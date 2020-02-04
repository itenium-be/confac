import {Router} from 'express';

import {getInvoices, createInvoice, previewPdfInvoice, deleteInvoice, updateInvoice, emailInvoice, generateExcelForInvoices} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);

invoicesRouter.post('/', createInvoice);
invoicesRouter.post('/email/:id', emailInvoice);
invoicesRouter.post('/preview', previewPdfInvoice);
invoicesRouter.post('/preview', previewPdfInvoice);
invoicesRouter.post('/excel', generateExcelForInvoices);

invoicesRouter.put('/', updateInvoice);

invoicesRouter.delete('/', deleteInvoice);

export default invoicesRouter;
