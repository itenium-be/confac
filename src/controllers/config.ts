import {Request, Response} from 'express';
import fs from 'fs';

import {ConfigCollection, DEFAULT_CONFIG} from '../models/config';
import appConfig from '../config';

export const getTemplatesPath = () => {
  if (appConfig.enable_root_templates) {
    return '/templates/';
  }
  return './templates/';

};

export const getCompanyConfig = async (req: Request, res: Response) => {
  const companyConfig = await ConfigCollection.findOne({key: 'conf'});

  if (companyConfig) {
    return res.send(companyConfig);
  }

  return res.send(DEFAULT_CONFIG);
};

export const getTemplates = (req: Request, res: Response) => {
  const templates = fs.readdirSync(getTemplatesPath()).filter(fileName => fileName.endsWith('.pug'));

  return res.send(templates);
};