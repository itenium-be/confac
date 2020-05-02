import {Router} from 'express';
import {authUser, getUsers, saveUser} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/login', authUser);
userRouter.put('/:id', saveUser);

export default userRouter;
