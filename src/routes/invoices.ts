import {Router} from 'express';

import {getInvoices, createInvoice, previewPdfInvoice, deleteInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);
invoicesRouter.delete('/', deleteInvoice);
invoicesRouter.post('/preview', previewPdfInvoice);

export default invoicesRouter;
