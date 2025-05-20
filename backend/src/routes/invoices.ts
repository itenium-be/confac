import {Router} from 'express';
import {emailInvoiceController} from '../controllers/emailInvoices';
import {
  getInvoicesController, createInvoiceController, previewPdfInvoiceController, deleteInvoiceController,
  updateInvoiceController, generateExcelForInvoicesController, getInvoiceXmlController, verifyInvoiceController,
} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoicesController);

invoicesRouter.post('/', createInvoiceController as any);
invoicesRouter.post('/email/:id', emailInvoiceController);
invoicesRouter.post('/preview', previewPdfInvoiceController);
invoicesRouter.post('/excel', generateExcelForInvoicesController);

invoicesRouter.put('/', updateInvoiceController as any);
invoicesRouter.put('/verify', verifyInvoiceController as any);

invoicesRouter.delete('/', deleteInvoiceController as any);
invoicesRouter.get('/xml/:id', getInvoiceXmlController);

export default invoicesRouter;
