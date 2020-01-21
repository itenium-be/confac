import {Request, Response} from 'express';
import {Clients} from '../models/clients';

export const getClients = async (req: Request, res: Response) => {
  const clients = await Clients.find();
  return res.send(clients);
};