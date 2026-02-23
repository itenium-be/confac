import {Router, RequestHandler} from 'express';
import {emailInvoiceController} from '../controllers/emailInvoices';
import {
  getInvoicesController, createInvoiceController, previewPdfInvoiceController, deleteInvoiceController,
  updateInvoiceController, generateExcelForInvoicesController, verifyInvoiceController,
  sendInvoiceToPeppolController, refreshPeppolStatusController,
} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoicesController);

invoicesRouter.post('/', createInvoiceController as unknown as RequestHandler);
invoicesRouter.post('/email/:id', emailInvoiceController);
invoicesRouter.post('/preview', previewPdfInvoiceController as unknown as RequestHandler);
invoicesRouter.post('/excel', generateExcelForInvoicesController);
invoicesRouter.post('/:id/peppol', sendInvoiceToPeppolController as unknown as RequestHandler);
invoicesRouter.post('/:id/peppol/refresh', refreshPeppolStatusController as unknown as RequestHandler);

invoicesRouter.put('/', updateInvoiceController as unknown as RequestHandler);
invoicesRouter.put('/verify', verifyInvoiceController as unknown as RequestHandler);

invoicesRouter.delete('/', deleteInvoiceController as unknown as RequestHandler);

export default invoicesRouter;
