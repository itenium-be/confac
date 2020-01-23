import {Router} from 'express';
import {getClients, validateBtw, createOrUpdateClient} from '../controllers/clients';

const clientsRouter = Router();

clientsRouter.get('/', getClients);
clientsRouter.get('/btw/:btw', validateBtw);

clientsRouter.post('/', createOrUpdateClient);

export default clientsRouter;
