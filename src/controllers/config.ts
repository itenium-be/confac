import {Request, Response} from 'express';
import fs from 'fs';

import {CompanyConfigCollection, DEFAULT_COMPANY_CONFIG, ICompanyConfig} from '../models/config';
import {getTemplatesPath} from './utils';

export const getCompanyConfig = async (req: Request, res: Response) => {
  const companyConfig = await CompanyConfigCollection.findOne({key: 'conf'});

  if (companyConfig) {
    return res.send(companyConfig);
  }

  return res.send(DEFAULT_COMPANY_CONFIG);
};

export const saveCompanyConfig = async (req: Request, res: Response) => {
  const {_id, ...companyConfig}: ICompanyConfig = req.body;

  if (_id) {
    const updatedCompanyConfig = await CompanyConfigCollection.findByIdAndUpdate({_id}, companyConfig, {new: true});
    return res.send(updatedCompanyConfig);
  }

  const createdCompanyConfig = await CompanyConfigCollection.create(companyConfig);
  return res.send(createdCompanyConfig);
};

export const getTemplates = (req: Request, res: Response) => {
  const templates = fs.readdirSync(getTemplatesPath()).filter(fileName => fileName.endsWith('.pug'));

  return res.send(templates);
};