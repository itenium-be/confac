import {Router} from 'express';
import multer from 'multer';
import * as attachmentsController from '../controllers/attachments';

const multiPartFormMiddleware = multer();

const attachmentsRouter = Router();

attachmentsRouter.get('/:model/:id/:type/:fileName', attachmentsController.getAttachmentController);
attachmentsRouter.post('/', attachmentsController.createZipWithInvoicesController);
attachmentsRouter.put('/:model/:id/:type', multiPartFormMiddleware.any(), attachmentsController.saveAttachmentController);
attachmentsRouter.delete('/:model/:id/:type', attachmentsController.deleteAttachmentController);

export default attachmentsRouter;
