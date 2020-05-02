import {Router} from 'express';
import {authUser} from '../controllers/user';

const userRouter = Router();

// userRouter.get('/:model/:id/:type/:fileName', getAttachmentController);
// userRouter.put('/:model/:id/:type', multiPartFormMiddleware.any(), saveAttachmentController);
// userRouter.delete('/:model/:id/:type', deleteAttachmentController);

userRouter.post('/login', authUser);

export default userRouter;
