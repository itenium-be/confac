import {Request, Response} from 'express';
import fs from 'fs';
import {ObjectID} from 'mongodb';
import appConfig from '../config';

import {DEFAULT_COMPANY_CONFIG, ICompanyConfig} from '../models/config';
import {getTemplatesPath} from './utils';
import {CollectionNames} from '../models/common';

export const getCompanyConfig = async (req: Request, res: Response) => {
  const companyConfig: ICompanyConfig | null = await req.db.collection(CollectionNames.CONFIG).findOne({key: 'conf'});

  if (companyConfig) {
    return res.send(companyConfig);
  }

  return res.send(DEFAULT_COMPANY_CONFIG);
};

export const saveCompanyConfig = async (req: Request, res: Response) => {
  const {_id, ...companyConfig}: ICompanyConfig = req.body;

  if (_id) {
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
