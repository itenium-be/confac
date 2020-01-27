import {Request, Response} from 'express';
import {ConsultantsCollection, IConsultant} from '../models/consultants';

export const getConsultants = async (req: Request, res: Response) => {
  const consultants = await ConsultantsCollection.find();
  return res.send(consultants);
};

export const createConsultant = async (req: Request, res: Response) => {
  const consultant: IConsultant = req.body;
  const createdConsultant = await ConsultantsCollection.create(consultant);
  return res.send(createdConsultant);
};
