import {Router} from 'express';

import {getAttachment, createZipWithInvoices} from '../controllers/attachments';

const attachmentsRouter = Router();

attachmentsRouter.get('/:model/:id/:type/:fileName', getAttachment);

attachmentsRouter.post('/', createZipWithInvoices);

export default attachmentsRouter;
