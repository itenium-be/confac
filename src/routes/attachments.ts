import {Router} from 'express';
import multer from 'multer';

import {getAttachmentController, createZipWithInvoicesController, saveAttachmentController, deleteAttachmentController} from '../controllers/attachments';

const multiPartFormMiddleware = multer();

const attachmentsRouter = Router();

attachmentsRouter.get('/:model/:id/:type/:fileName', getAttachmentController);

attachmentsRouter.post('/', createZipWithInvoicesController);

attachmentsRouter.put('/:model/:id/:type', multiPartFormMiddleware.any(), saveAttachmentController);

attachmentsRouter.delete('/:model/:id/:type', deleteAttachmentController);

export default attachmentsRouter;
