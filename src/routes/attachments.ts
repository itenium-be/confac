import {Router} from 'express';

import {getAttachment} from '../controllers/attachments';

const attachmentsRouter = Router();

attachmentsRouter.get('/:model/:id/:type/:fileName', getAttachment);

export default attachmentsRouter;
