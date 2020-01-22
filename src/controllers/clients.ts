import {Request, Response} from 'express';
import fetch from 'node-fetch';

import {ClientsCollection} from '../models/clients';

export const getClients = async (req: Request, res: Response) => {
  const clients = await ClientsCollection.find();
  return res.send(clients);
};

export const validateBtw = async (req: Request, res: Response) => {
  const url = `https://controleerbtwnummer.eu/api/validate/${req.query.btw}.json`;
  const result = await fetch(url).then(response => response.json());
  return res.send(result);
};