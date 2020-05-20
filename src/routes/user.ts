import {Router} from 'express';
import {authUser, getUsers, saveUser, refreshToken} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/login', authUser);
userRouter.post('/refresh', refreshToken);
userRouter.put('/', saveUser);

export default userRouter;
