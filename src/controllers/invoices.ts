import {Request, Response} from 'express';
import {InvoicesCollection} from '../models/invoices';

export const getInvoices = async (req: Request, res: Response) => {
  const invoices = await InvoicesCollection.find();
  return res.send(invoices);
};