 
import {Request, Response} from 'express';
import {ObjectID} from 'mongodb';
import {OAuth2Client, TokenPayload} from 'google-auth-library';
import jwt from 'jsonwebtoken';
import {CollectionNames, SocketEventTypes, createAudit, updateAudit} from '../models/common';
import config from '../config';
import {IUser, IRole} from '../models/user';
import {ConfacRequest} from '../models/technical';
import {saveAudit} from './utils/audit-logs';
import {emitEntityEvent} from './utils/entity-events';

const AdminRole = 'admin';


export async function verify(token: string): Promise<string | IUser> {
  const client = new OAuth2Client(config.security.clientId);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.security.clientId,
  });
  const payload: TokenPayload | undefined = ticket.getPayload();
  if (!payload) {
    return 'Invalid token';
  }
  if (!payload.email_verified || !payload.email) {
    return 'Email not verified';
  }
  if (payload.aud !== config.security.clientId) {
    return 'Invalid audience';
  }

  const domain = payload.hd;
  if (config.security.domain && config.security.domain !== domain) {
    return 'Invalid domain';
  }

  // const userLocale = (payload as any).locale; // ex: "en"
  // const userId = payload.sub;
  return {
    _id: new ObjectID(),
    email: payload.email,
    name: payload.family_name || '',
    alias: payload.given_name || '',
    firstName: payload.given_name || '',
    active: !!config.security.defaultRole,
    audit: createAudit(),
    roles: config.security.defaultRole ? [config.security.defaultRole] : [],
  };
}


export const refreshToken = async (req: Request, res: Response) => {
  const ourToken = jwt.sign({data: (req as any).user.data}, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
  return res.status(200).send({jwt: ourToken});
};


export const authUser = async (req: Request, res: Response) => {
  res.status(400);

  const result = await verify(req.body.idToken).catch(err => {
    req.logger.error('authUser idToken verification error', err);
  });
  if (typeof result === 'string' || !result) {
    return res.send({err: result || 'Unknown error'});
  }

  const logDate = new Date().toISOString();
  const usersLogCollection = req.db.collection('logs_logins');
  const usersCollection = req.db.collection<IUser>(CollectionNames.USERS);
  let user = await usersCollection.findOne({email: result.email});
  if (!user) {
    if (result.email === config.jwt.superUser) {
      result.active = true;
      result.roles = result.roles.concat([AdminRole]);
      user = result;
      await usersLogCollection.insertOne({
        user,
        login: 'success',
        msg: 'Superuser activated',
        date: logDate,
      });
    }

    await usersCollection.insert(result);

    if (!result.active) {
      await usersLogCollection.insertOne({
        user: result,
        login: 'failure',
        msg: 'First login, user created but not yet activated',
        date: logDate,
      });
      return res.send({err: 'New user: not yet activated'});
    }

  } else if (!user.active) {
    await usersLogCollection.insertOne({
      user,
      login: 'failure',
      msg: 'User has been de-activated in confac',
      date: logDate,
    });
    return res.send({err: 'User no longer active'});
  }

  await usersLogCollection.insertOne({
    user,
    login: 'success',
    msg: 'User logged in',
    date: logDate,
  });
  const ourToken = jwt.sign({data: user}, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
  return res.status(200).send({jwt: ourToken});
};



export const getUsers = async (req: Request, res: Response) => {
  const users = await req.db.collection<IUser>(CollectionNames.USERS).find().toArray();
  return res.send(users);
};




export const saveUser = async (req: ConfacRequest, res: Response) => {
  const {_id, ...user}: IUser = req.body;
  const collection = req.db.collection<IUser>(CollectionNames.USERS);

  if (_id) {
    user.audit = updateAudit(user.audit, req.user);
    const {value: originalUser} = await collection.findOneAndUpdate({_id: new ObjectID(_id)}, {$set: user}, {returnOriginal: true});
    await saveAudit(req, 'user', originalUser, user);
    const responseUser = {_id, ...user};
    emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.USERS, _id, responseUser);
    return res.send(responseUser);
  }

  user.audit = createAudit(req.user);
  const inserted = await collection.insertOne(user);
  const [createdUser] = inserted.ops;
  emitEntityEvent(req, SocketEventTypes.EntityCreated, CollectionNames.USERS, createdUser._id, createdUser);
  return res.send(createdUser);
};






export const getRoles = async (req: Request, res: Response) => {
  const roles = await req.db.collection<IRole>(CollectionNames.ROLES).find().toArray();
  return res.send(roles);
};





export const saveRole = async (req: ConfacRequest, res: Response) => {
  const {_id, ...role}: IRole = req.body;
  const collection = req.db.collection<IRole>(CollectionNames.ROLES);

  if (_id) {
    role.audit = updateAudit(role.audit, req.user);
    const {value: originalRole} = await collection.findOneAndUpdate({_id: new ObjectID(_id)}, {$set: role}, {returnOriginal: true});
    await saveAudit(req, 'role', originalRole, role);

    const responseRole = {_id, ...role};
    emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.ROLES, _id, responseRole);
    return res.send(responseRole);
  }

  role.audit = createAudit(req.user);
  const inserted = await collection.insertOne(role);
  const [createdRole] = inserted.ops;
  emitEntityEvent(req, SocketEventTypes.EntityCreated, CollectionNames.ROLES, createdRole._id, createdRole);
  return res.send(createdRole);
};
