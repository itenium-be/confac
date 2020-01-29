import {Router} from 'express';
import {getInvoices, createInvoice, previewPdfInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);
invoicesRouter.post('/preview', previewPdfInvoice);

export default invoicesRouter;
