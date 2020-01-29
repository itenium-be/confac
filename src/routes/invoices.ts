import {Router} from 'express';
import {getInvoices, createInvoice, updateInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);
invoicesRouter.put('/', updateInvoice);

export default invoicesRouter;
