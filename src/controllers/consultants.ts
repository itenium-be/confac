import {Request, Response} from 'express';
import slugify from 'slugify';
import {ObjectID} from 'mongodb';

import {IConsultant} from '../models/consultants';
import {CollectionNames} from '../models/common';

export const getConsultants = async (req: Request, res: Response) => {
  const consultants = await req.db.collection<IConsultant>(CollectionNames.CONSULTANTS).find()
    .toArray();
  return res.send(consultants);
};

export const saveConsultant = async (req: Request, res: Response) => {
  const {_id, ...consultant}: IConsultant = req.body;

  if (_id) {
    const inserted = await req.db.collection<IConsultant>(CollectionNames.CONSULTANTS).findOneAndUpdate({_id: new ObjectID(_id)}, {$set: consultant}, {returnOriginal: false});
    const updatedConsultant = inserted.value;
    return res.send(updatedConsultant);
  }

  const slug = slugify(`${consultant.firstName}-${consultant.name}`).toLowerCase();
  consultant.slug = slug;

  const inserted = await req.db.collection<Omit<IConsultant, '_id'>>('consultants').insertOne({
    ...consultant,
    createdOn: new Date().toISOString(),
  });
  const [createdConsultant] = inserted.ops;
  return res.send(createdConsultant);
};
