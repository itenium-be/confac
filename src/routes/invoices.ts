import {Router} from 'express';
import {getInvoices} from '../controllers/invoices';

const invoicesRouter = Router();

invoicesRouter.get('/', getInvoices);

export default invoicesRouter;
