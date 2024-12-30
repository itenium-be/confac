import {Request, Response} from 'express';
import slugify from 'slugify';
import {ObjectID} from 'mongodb';
import {IConsultant} from '../models/consultants';
import {CollectionNames, createAudit, SocketEventTypes, updateAudit} from '../models/common';
import {ConfacRequest} from '../models/technical';
import {saveAudit} from './utils/audit-logs';
import { emitEntityEvent } from './utils/entity-events';

export const getConsultants = async (req: Request, res: Response) => {
  const consultants = await req.db.collection<IConsultant>(CollectionNames.CONSULTANTS).find().toArray();
  return res.send(consultants);
};

export const saveConsultant = async (req: ConfacRequest, res: Response) => {
  const {_id, ...consultant}: IConsultant = req.body;

  if (_id) {
    consultant.audit = updateAudit(consultant.audit, req.user);
    const {value: originalConsultant} = await req.db.collection<IConsultant>(CollectionNames.CONSULTANTS)
      .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: consultant}, {returnOriginal: true});

    await saveAudit(req, 'consultant', originalConsultant, consultant);
    const responseConsultant = {_id, ...consultant};
    emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.CONSULTANTS, _id, responseConsultant);
    return res.send(responseConsultant);
  }

  const slug = slugify(`${consultant.firstName}-${consultant.name}`).toLowerCase();
  consultant.slug = slug;

  const inserted = await req.db.collection<Omit<IConsultant, '_id'>>('consultants').insertOne({
    ...consultant,
    audit: createAudit(req.user),
  });
  const [createdConsultant] = inserted.ops;
  emitEntityEvent(req, SocketEventTypes.EntityCreated, CollectionNames.CONSULTANTS, createdConsultant._id, createdConsultant);
  return res.send(createdConsultant);
};
