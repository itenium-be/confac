import {Router} from 'express';
import jwt from 'express-jwt';
import config from '../config';


import clientsRouter from './clients';
import consultantsRouter from './consultants';
import projectsRouter from './projects';
import invoicesRouter from './invoices';
import configRouter from './config';
import attachmentsRouter from './attachments';
import userRouter from './user';

const appRouter = Router();

const jwtMiddleware = () => jwt({secret: config.jwt.secret});

appRouter.use('/user', jwtMiddleware().unless({path: ['/api/user/login']}), userRouter);

appRouter.use('/clients', jwtMiddleware(), clientsRouter);
appRouter.use('/consultants', jwtMiddleware(), consultantsRouter);
appRouter.use('/projects', jwtMiddleware(), projectsRouter);
appRouter.use('/invoices', jwtMiddleware(), invoicesRouter);
appRouter.use('/config', jwtMiddleware(), configRouter);
appRouter.use('/attachments', jwtMiddleware(), attachmentsRouter);


export default appRouter;
