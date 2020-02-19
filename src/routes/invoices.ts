import {Router} from 'express';

import {
  getInvoicesController, createInvoiceController, previewPdfInvoiceController, deleteInvoiceController, updateInvoiceController, emailInvoiceController, generateExcelForInvoicesController,
} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoicesController);

invoicesRouter.post('/', createInvoiceController);
invoicesRouter.post('/email/:id', emailInvoiceController);
invoicesRouter.post('/preview', previewPdfInvoiceController);
invoicesRouter.post('/excel', generateExcelForInvoicesController);

invoicesRouter.put('/', updateInvoiceController);

invoicesRouter.delete('/', deleteInvoiceController);

export default invoicesRouter;
