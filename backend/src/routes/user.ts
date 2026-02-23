import {Router, RequestHandler} from 'express';
import {authUser, getUsers, saveUser, refreshToken, getRoles, saveRole} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/login', authUser);
userRouter.post('/refresh', refreshToken);
userRouter.put('/', saveUser as RequestHandler);

userRouter.get('/roles', getRoles);
userRouter.put('/roles', saveRole as RequestHandler);

export default userRouter;
