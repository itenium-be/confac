import {Router} from 'express';
import {orderCreatedWebhook, orderUpdatedWebhook, messageCreatedWebhook, messageUpdatedWebhook} from '../controllers/billitWebhooks';

const configRouter = Router();

configRouter.post('/order-created', orderCreatedWebhook as any);
configRouter.post('/order-updated', orderUpdatedWebhook as any);
configRouter.post('/message-created', messageCreatedWebhook as any);
configRouter.post('/message-updated', messageUpdatedWebhook as any);

export default configRouter;
