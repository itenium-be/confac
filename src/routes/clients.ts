import {Router} from 'express';
import {getClients, validateBtw} from '../controllers/clients';

const clientsRouter = Router();

clientsRouter.get('/', getClients);
clientsRouter.get('/btw/:btw', validateBtw);

export default clientsRouter;
