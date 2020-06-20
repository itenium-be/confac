import {Router} from 'express';
import {authUser, getUsers, saveUser, refreshToken, getRoles, saveRole} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/login', authUser);
userRouter.post('/refresh', refreshToken);
userRouter.put('/', saveUser as any);

userRouter.get('/roles', getRoles);
userRouter.put('/roles', saveRole);

export default userRouter;
