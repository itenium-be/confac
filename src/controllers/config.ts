import {Request, Response} from 'express';
import fs from 'fs';
import {ObjectID} from 'mongodb';
import appConfig from '../config';
import {ICompanyConfig} from '../models/config';
import {getTemplatesPath} from './utils';
import {CollectionNames, updateAudit} from '../models/common';
import {ConfacRequest} from '../models/technical';

export const getCompanyConfig = async (req: Request, res: Response) => {
  const companyConfig: ICompanyConfig | null = await req.db.collection(CollectionNames.CONFIG).findOne({key: 'conf'});

  if (companyConfig) {
    return res.send(companyConfig);
  }

  // A default config is defined on the frontend
  return res.status(404).send();
};


/** Unprotected route */
export const getSecurityConfig = async (req: Request, res: Response) => {
  return res.send({
    googleClientId: appConfig.security.clientId,
    jwtInterval: Math.floor(appConfig.jwt.expiresIn / 2),
  });
};



export const saveCompanyConfig = async (req: ConfacRequest, res: Response) => {
  const {_id, ...companyConfig}: ICompanyConfig = req.body;

  if (_id) {
    companyConfig.audit = updateAudit(companyConfig.audit, req.user);

    const inserted = await req.db.collection<ICompanyConfig>(CollectionNames.CONFIG)
      .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: companyConfig}, {returnOriginal: false});

    const updatedCompanyConfig = inserted.value;
    return res.send(updatedCompanyConfig);
  }

  const inserted = await req.db.collection<ICompanyConfig>(CollectionNames.CONFIG).insertOne(companyConfig);
  const [createdCompanyConfig] = inserted.ops;
  return res.send(createdCompanyConfig);
};

export const getTemplates = (req: Request, res: Response) => {
  const templates = fs.readdirSync(getTemplatesPath()).filter(fileName => fileName.endsWith('.pug'));

  return res.send(templates);
};
