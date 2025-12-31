import {Router} from 'express';
import {getClients, validateBtw, saveClient} from '../controllers/clients';
import {syncClientPeppolStatusController} from '../controllers/invoices';

const clientsRouter = Router();

clientsRouter.get('/', getClients);
clientsRouter.get('/btw/:btw', validateBtw);

clientsRouter.post('/', saveClient as any);
clientsRouter.post('/:clientId/peppol/sync', syncClientPeppolStatusController as any);

export default clientsRouter;
