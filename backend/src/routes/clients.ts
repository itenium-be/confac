import {Router} from 'express';
import {getClients, validateBtw, saveClient} from '../controllers/clients';

const clientsRouter = Router();

clientsRouter.get('/', getClients);
clientsRouter.get('/btw/:btw', validateBtw);

clientsRouter.post('/', saveClient as any);

export default clientsRouter;
