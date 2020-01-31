import {Router} from 'express';

import {getInvoices, createInvoice, updateInvoice, previewPdfInvoice} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);
invoicesRouter.post('/', createInvoice);
invoicesRouter.put('/', updateInvoice);
invoicesRouter.post('/preview', previewPdfInvoice);

export default invoicesRouter;
