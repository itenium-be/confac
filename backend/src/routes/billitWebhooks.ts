import {Router} from 'express';
import {orderCreatedWebhook, orderUpdatedWebhook, messageCreatedWebhook, messageUpdatedWebhook} from '../controllers/billitWebhooks';

const configRouter = Router();

configRouter.post('/order-created', orderCreatedWebhook);
configRouter.post('/order-updated', orderUpdatedWebhook);
configRouter.post('/message-created', messageCreatedWebhook);
configRouter.post('/message-updated', messageUpdatedWebhook);

export default configRouter;
