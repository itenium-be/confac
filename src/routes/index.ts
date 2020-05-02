import {Router} from 'express';

import clientsRouter from './clients';
import consultantsRouter from './consultants';
import projectsRouter from './projects';
import invoicesRouter from './invoices';
import configRouter from './config';
import attachmentsRouter from './attachments';
import userRouter from './user';

const appRouter = Router();

appRouter.use('/user', userRouter);

appRouter.use('/clients', clientsRouter);
appRouter.use('/consultants', consultantsRouter);
appRouter.use('/projects', projectsRouter);
appRouter.use('/invoices', invoicesRouter);
appRouter.use('/config', configRouter);
appRouter.use('/attachments', attachmentsRouter);

export default appRouter;
