import {Request, Response} from 'express';
import slugify from 'slugify';
import fetch from 'node-fetch';

import {ClientsCollection, IClient} from '../models/clients';

export const getClients = async (req: Request, res: Response) => {
  const clients = await ClientsCollection.find();
  return res.send(clients);
};

export const validateBtw = async (req: Request, res: Response) => {
  const url = `https://controleerbtwnummer.eu/api/validate/${req.query.btw}.json`;
  const result = await fetch(url).then(response => response.json());
  return res.send(result);
};

const updateClient = async (id: string, client: IClient): Promise<IClient> => {
  const updatedClient = await ClientsCollection.findByIdAndUpdate({_id: id}, client, {new: true});
  return updatedClient as IClient;
};

const createClient = async (client: IClient): Promise<IClient> => {
  const slug = slugify(client.name).toLowerCase();
  const createdClient = await ClientsCollection.create({
    ...client,
    slug,
  });
  return createdClient;
};

export const createOrUpdateClient = async (req: Request, res: Response) => {
  const {_id, ...client} = req.body;
  if (_id) {
    const updatedClient = await updateClient(_id, client);
    return res.send(updatedClient);
  }
  const createdClient = await createClient(client);
  return res.send(createdClient);
};