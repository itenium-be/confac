/* eslint-disable no-console */
import {Request, Response} from 'express';
import {OAuth2Client} from 'google-auth-library';
import jwt from 'jsonwebtoken';
import {CollectionNames} from '../models/common';
import config from '../config';
import {IUser} from '../models/user';


const client = new OAuth2Client(config.security.clientId);


async function verify(token: string): Promise<string | {email: string;}> {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.security.clientId,
  });
  const payload = ticket.getPayload();
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
  return {email: payload.email};
}




export const authUser = async (req: Request, res: Response) => {
  res.status(400);

  const result = await verify(req.body.idToken).catch(console.error);
  if (typeof result === 'string' || !result) {
    return res.send({err: result || 'Unknown error'});
  }

  const user = await req.db.collection<IUser>(CollectionNames.USERS).findOne({email: result.email});
  if (!user) {
    return res.send({err: 'Unknown user'});
  }
  if (!user.active) {
    return res.send({err: 'User no longer active'});
  }

  const ourToken = jwt.sign({data: user}, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
  return res.status(200).send({jwt: ourToken});
};
