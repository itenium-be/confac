import {Request, Response} from 'express';
import slugify from 'slugify';
import {ConsultantsCollection, IConsultant} from '../models/consultants';

export const getConsultants = async (req: Request, res: Response) => {
  const consultants = await ConsultantsCollection.find();
  return res.send(consultants);
};

export const saveConsultant = async (req: Request, res: Response) => {
  const {_id, ...consultant}: IConsultant = req.body;

  if (_id) {
    const updatedConsultant = await ConsultantsCollection.findByIdAndUpdate({_id}, consultant, {new: true});
    return res.send(updatedConsultant);
  }

  const slug = slugify(`${consultant.firstName}-${consultant.name}`).toLowerCase();
  consultant.slug = slug;

  const createdConsultant = await ConsultantsCollection.create(consultant);
  return res.send(createdConsultant);
};
