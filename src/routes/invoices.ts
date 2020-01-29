import {Router} from 'express';
import {getInvoices, createInvoice, deleteInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);
invoicesRouter.delete('/', deleteInvoice);

export default invoicesRouter;
