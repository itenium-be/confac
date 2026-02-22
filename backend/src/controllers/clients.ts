import {Request, Response} from 'express';
import slugify from 'slugify';
import fetch from 'node-fetch';
import {ObjectID} from 'mongodb';
import {IClient} from '../models/clients';
import {CollectionNames, updateAudit, createAudit, SocketEventTypes} from '../models/common';
import {ConfacRequest} from '../models/technical';
import {saveAudit} from './utils/audit-logs';
import {emitEntityEvent} from './utils/entity-events';


export const getClients = async (req: Request, res: Response) => {
  const clients = await req.db.collection(CollectionNames.CLIENTS).find()
    .toArray();
  return res.send(clients);
};


export const validateBtw = async (req: Request<{btw: string}>, res: Response) => {
  const url = `https://controleerbtwnummer.eu/api/validate/${req.params.btw}.json`;
  const result = await fetch(url).then(response => response.json());
  return res.send(result);
};


export const saveClient = async (req: ConfacRequest, res: Response) => {
  const {_id, ...client}: IClient = req.body;

  if (_id) {
    client.audit = updateAudit(client.audit, req.user);
    const clientsCollection = req.db.collection<IClient>(CollectionNames.CLIENTS);
    const {value: originalClient} = await clientsCollection.findOneAndUpdate(
      {_id: new ObjectID(_id)},
      {$set: client},
      {returnOriginal: true},
    );

    await saveAudit(req, 'client', originalClient, client);
    const clientResponse = {_id, ...client};
    emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.CLIENTS, _id, clientResponse);
    return res.send(clientResponse);
  }


  client.slug = slugify(client.name).toLowerCase();
  client.audit = createAudit(req.user);
  const inserted = await req.db.collection(CollectionNames.CLIENTS).insertOne(client);
  const [createdClient] = inserted.ops;
  emitEntityEvent(req, SocketEventTypes.EntityCreated, CollectionNames.CLIENTS, createdClient._id, createdClient);
  return res.send(createdClient);
};
