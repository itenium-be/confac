import {Router} from 'express';
import {getInvoices, createInvoice, emailInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);
invoicesRouter.post('/email/:id', emailInvoice);

export default invoicesRouter;
