import {Router} from 'express';
import multer from 'multer';

import {getAttachment, createZipWithInvoices, addAttachment, deleteAttachment} from '../controllers/attachments';

const multiPartFormMiddleware = multer();

const attachmentsRouter = Router();

attachmentsRouter.get('/:model/:id/:type/:fileName', getAttachment);

attachmentsRouter.post('/', createZipWithInvoices);

attachmentsRouter.put('/:model/:id/:type', multiPartFormMiddleware.any(), addAttachment);

attachmentsRouter.delete('/:model/:id/:type', deleteAttachment);

export default attachmentsRouter;
