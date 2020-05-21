import {Router} from 'express';

import {
  getInvoicesController, createInvoiceController, previewPdfInvoiceController, deleteInvoiceController, updateInvoiceController, emailInvoiceController, generateExcelForInvoicesController,
} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoicesController);

invoicesRouter.post('/', createInvoiceController as any);
invoicesRouter.post('/email/:id', emailInvoiceController);
invoicesRouter.post('/preview', previewPdfInvoiceController);
invoicesRouter.post('/excel', generateExcelForInvoicesController);

invoicesRouter.put('/', updateInvoiceController as any);

invoicesRouter.delete('/', deleteInvoiceController);

export default invoicesRouter;
