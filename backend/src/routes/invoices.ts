import {Router} from 'express';
import {emailInvoiceController} from '../controllers/emailInvoices';
import {
  getInvoicesController, createInvoiceController, previewPdfInvoiceController, deleteInvoiceController,
  updateInvoiceController, generateExcelForInvoicesController, verifyInvoiceController,
  sendInvoiceToPeppolController,
} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoicesController);

invoicesRouter.post('/', createInvoiceController as any);
invoicesRouter.post('/email/:id', emailInvoiceController);
invoicesRouter.post('/preview', previewPdfInvoiceController);
invoicesRouter.post('/excel', generateExcelForInvoicesController);
invoicesRouter.post('/:id/peppol', sendInvoiceToPeppolController as any);

invoicesRouter.put('/', updateInvoiceController as any);
invoicesRouter.put('/verify', verifyInvoiceController as any);

invoicesRouter.delete('/', deleteInvoiceController as any);

export default invoicesRouter;
