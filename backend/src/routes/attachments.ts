import {Request, Response, NextFunction, Router} from 'express';
import multer from 'multer';
import * as attachmentsController from '../controllers/attachments';

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  'pdf',
  'png', 'bmp', 'jpg', 'jpeg', 'gif',
  'ppt', 'pptx',
  'txt',
  'xls', 'xlsx', 'xlsm',
  'csv',
  'doc', 'docx',
  'odp', 'ods', 'odt',
]);

export class UnsupportedFileTypeError extends Error {
  displayExt: string;

  constructor(displayExt: string) {
    super(`Unsupported file type: ${displayExt}`);
    this.name = 'UnsupportedFileTypeError';
    this.displayExt = displayExt;
  }
}

export const attachmentFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const name = file.originalname || '';
  const dot = name.lastIndexOf('.');
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
  if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
    const displayExt = ext ? `.${ext}` : '(none)';
    return cb(new UnsupportedFileTypeError(displayExt));
  }
  return cb(null, true);
};

const multiPartFormMiddleware = multer({
  limits: {fileSize: MAX_UPLOAD_BYTES, files: 1},
  fileFilter: attachmentFileFilter,
});

const uploadSingleAttachment = (req: Request, res: Response, next: NextFunction) => {
  multiPartFormMiddleware.any()(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send({
          message: 'attachment.uploadTooLarge',
          data: {maxMB: Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)},
        });
      }
      return res.status(400).send({message: 'attachment.uploadError', data: {reason: err.message}});
    }
    if (err instanceof UnsupportedFileTypeError) {
      return res.status(415).send({
        message: 'attachment.unsupportedType',
        data: {ext: err.displayExt},
      });
    }
    if (err instanceof Error) {
      return res.status(400).send({message: 'attachment.uploadError', data: {reason: err.message}});
    }
    return next();
  });
};

const attachmentsRouter = Router();

attachmentsRouter.get('/:model/:id/:type/:fileName', attachmentsController.getAttachmentController);
attachmentsRouter.post('/', attachmentsController.createZipWithInvoicesController);
attachmentsRouter.put('/:model/:id/:type', uploadSingleAttachment, attachmentsController.saveAttachmentController);
attachmentsRouter.delete('/:model/:id/:type', attachmentsController.deleteAttachmentController);

export default attachmentsRouter;
