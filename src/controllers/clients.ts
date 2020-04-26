import {Request, Response} from 'express';
import slugify from 'slugify';
import fetch from 'node-fetch';

import {ObjectID} from 'mongodb';
import {IClient} from '../models/clients';
import {CollectionNames} from '../models/common';

export const getClients = async (req: Request, res: Response) => {
  const clients = await req.db.collection(CollectionNames.CLIENTS).find()
    .toArray();
  return res.send(clients);
};

export const validateBtw = async (req: Request, res: Response) => {
  const url = `https://controleerbtwnummer.eu/api/validate/${req.params.btw}.json`;
  // TODO: Apparently the controleerbtwnummer.eu API is not very stable
  // Getting alot of 500 responses
  // console.log('btw fetch url', url);
  const result = await fetch(url).then(response => response.json());
  return res.send(result);
};

export const saveClient = async (req: Request, res: Response) => {
  const {_id, ...client}: IClient = req.body;

  if (_id) {
    const inserted = await req.db.collection<IClient>(CollectionNames.CLIENTS).findOneAndUpdate({_id: new ObjectID(_id)}, {$set: client}, {returnOriginal: false});
    const updatedClient = inserted.value;
    return res.send(updatedClient);
  }

  client.slug = slugify(client.name).toLowerCase();
  const inserted = await req.db.collection(CollectionNames.CLIENTS).insertOne(client);
  const [createdClient] = inserted.ops;
  return res.send(createdClient);
};
