import {Router} from 'express';

import clientsRouter from './clients';

const appRouter = Router();

appRouter.use(clientsRouter);

export default appRouter;
