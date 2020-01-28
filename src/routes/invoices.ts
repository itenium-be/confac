import {Router} from 'express';
import {getInvoices, createInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);

export default invoicesRouter;
