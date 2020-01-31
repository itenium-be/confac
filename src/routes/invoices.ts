import {Router} from 'express';

import {getInvoices, createInvoice, previewPdfInvoice, deleteInvoice, emailInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);
invoicesRouter.post('/email/:id', emailInvoice);
invoicesRouter.post('/preview', previewPdfInvoice);
invoicesRouter.delete('/', deleteInvoice);

export default invoicesRouter;
