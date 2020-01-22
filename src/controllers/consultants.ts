import {Request, Response} from 'express';
import {ConsultantsCollection} from '../models/consultants';

export const getConsultants = async (req: Request, res: Response) => {
  const consultants = await ConsultantsCollection.find();
  return res.send(consultants);
};