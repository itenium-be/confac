import {Request, Response} from 'express';
import fs from 'fs';
import {ObjectID} from 'mongodb';
import appConfig from '../config';
import {ICompanyConfig} from '../models/config';
import {getTemplatesPath} from './utils';
import {CollectionNames, updateAudit} from '../models/common';
import {ConfacRequest} from '../models/technical';
import {saveAudit} from './utils/audit-logs';

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
    env: appConfig.ENVIRONMENT,
    tag: appConfig.tag,
  });
};



export const saveCompanyConfig = async (req: ConfacRequest, res: Response) => {
  const {_id, ...config}: ICompanyConfig = req.body;

  if (_id) {
    config.audit = updateAudit(config.audit, req.user);

    const {value: originalConfig} = await req.db.collection<ICompanyConfig>(CollectionNames.CONFIG)
      .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: config}, {returnOriginal: true});

    await saveAudit(req, 'config', originalConfig, config);
    return res.send({_id, ...config});
  }

  const inserted = await req.db.collection<ICompanyConfig>(CollectionNames.CONFIG).insertOne(config);
  return res.send(inserted.ops[0]);
};


/** Get all pug invoice template filenames */
export const getTemplates = (req: Request, res: Response) => {
  const templates = fs.readdirSync(getTemplatesPath()).filter(fileName => fileName.endsWith('.pug'));
  return res.send(templates);
};



/** Get logs_audit for an entity */
export const getAudit = async (req: Request<void, void, void, {model: string, modelId: number}>, res: Response) => {
  const logs = await req.db.collection('logs_audit')
    .find({model: req.query.model, modelId: new ObjectID(req.query.modelId)})
    .toArray();

  return res.send(logs);
};

export const DEFAULT_CURRENCY = 'EUR';
export const DEFAULT_COUNTRY_CODE = 'BE';
