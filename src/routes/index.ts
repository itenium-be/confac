import {Router} from 'express';

import clientsRouter from './clients';
import consultantsRouter from './consultants';
import projectsRouter from './projects';
import invoicesRouter from './invoices';
import configRouter from './config';

const appRouter = Router();

appRouter.use('/clients', clientsRouter);
appRouter.use('/consultants', consultantsRouter);
appRouter.use('/projects', projectsRouter);
appRouter.use('/invoices', invoicesRouter);
appRouter.use('/config', configRouter);

export default appRouter;
