/* eslint-disable no-console */
import {Request, Response} from 'express';
import {ObjectID} from 'mongodb';
import {OAuth2Client, TokenPayload} from 'google-auth-library';
import jwt from 'jsonwebtoken';
import {CollectionNames, IAudit, createAudit, updateAudit} from '../models/common';
import config from '../config';
import {IUser, IRole} from '../models/user';
import {ConfacRequest} from '../models/technical';


const client = new OAuth2Client(config.security.clientId);


async function verify(token: string): Promise<string | IUser> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.security.clientId,
  });
  const payload: TokenPayload | undefined = ticket.getPayload();
  // console.log('payload', payload);
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
  const ourToken = jwt.sign({data: (req as any).user}, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
  return res.status(200).send({jwt: ourToken});
};


export const authUser = async (req: Request, res: Response) => {
  res.status(400);

  const result = await verify(req.body.idToken).catch(console.error);
  if (typeof result === 'string' || !result) {
    return res.send({err: result || 'Unknown error'});
  }

  const usersCollection = req.db.collection<IUser>(CollectionNames.USERS);
  let user = await usersCollection.findOne({email: result.email});
  if (!user) {
    if (result.email === config.jwt.superUser) {
      result.active = true;
      user = result;
    }

    await usersCollection.insert(result);

    if (!result.active) {
      return res.send({err: 'New user: not yet activated'});
    }

  } else if (!user.active) {
    return res.send({err: 'User no longer active'});
  }

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
    const updated = await collection.findOneAndUpdate({_id: new ObjectID(_id)}, {$set: user}, {returnOriginal: false});
    return res.send(updated.value);
  }

  user.audit = createAudit(req.user);
  const inserted = await collection.insertOne(user);
  const [createdClient] = inserted.ops;
  return res.send(createdClient);
};






export const getRoles = async (req: Request, res: Response) => {
  const users = await req.db.collection<IRole>(CollectionNames.ROLES).find().toArray();
  return res.send(users);
};





export const saveRole = async (req: ConfacRequest, res: Response) => {
  const {_id, ...role}: IRole = req.body;
  const collection = req.db.collection<IRole>(CollectionNames.ROLES);

  if (_id) {
    role.audit = updateAudit(role.audit, req.user);
    const updated = await collection.findOneAndUpdate({_id: new ObjectID(_id)}, {$set: role}, {returnOriginal: false});
    return res.send(updated.value);
  }

  role.audit = createAudit(req.user);
  const inserted = await collection.insertOne(role);
  const [createdClient] = inserted.ops;
  return res.send(createdClient);
};
