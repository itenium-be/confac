import {Router} from 'express';
import {emailInvoiceController} from '../controllers/emailInvoices';
import {
  getInvoicesController, createInvoiceController, previewPdfInvoiceController, deleteInvoiceController,
  updateInvoiceController, generateExcelForInvoicesController, getInvoiceXmlController, verifyInvoiceController,
  checkPeppolRegistrationController,
} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoicesController);
invoicesRouter.get('/xml/:id', getInvoiceXmlController);

invoicesRouter.post('/', createInvoiceController as any);
invoicesRouter.post('/email/:id', emailInvoiceController);
invoicesRouter.post('/preview', previewPdfInvoiceController);
invoicesRouter.post('/excel', generateExcelForInvoicesController);
invoicesRouter.post('/:id/peppol', checkPeppolRegistrationController as any);

invoicesRouter.put('/', updateInvoiceController as any);
invoicesRouter.put('/verify', verifyInvoiceController as any);

invoicesRouter.delete('/', deleteInvoiceController as any);

export default invoicesRouter;
