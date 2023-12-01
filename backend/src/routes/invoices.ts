import {Router} from 'express';
import { emailInvoiceController } from '../controllers/emailInvoices';
import {
  getInvoicesController, createInvoiceController, previewPdfInvoiceController, deleteInvoiceController,
  updateInvoiceController, generateExcelForInvoicesController, getInvoiceXmlController, testXMlController,
} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoicesController);

invoicesRouter.post('/', createInvoiceController as any);
invoicesRouter.post('/email/:id', emailInvoiceController);
invoicesRouter.post('/preview', previewPdfInvoiceController);
invoicesRouter.post('/excel', generateExcelForInvoicesController);

invoicesRouter.put('/', updateInvoiceController as any);

invoicesRouter.delete('/', deleteInvoiceController);
invoicesRouter.post('/xml', getInvoiceXmlController);
invoicesRouter.post('/test', testXMlController);

export default invoicesRouter;
