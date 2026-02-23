import {Router, RequestHandler} from 'express';
import {orderCreatedWebhook, orderUpdatedWebhook, messageCreatedWebhook, messageUpdatedWebhook} from '../controllers/billitWebhooks';

const configRouter = Router();

configRouter.post('/order-created', orderCreatedWebhook as unknown as RequestHandler);
configRouter.post('/order-updated', orderUpdatedWebhook as unknown as RequestHandler);
configRouter.post('/message-created', messageCreatedWebhook as unknown as RequestHandler);
configRouter.post('/message-updated', messageUpdatedWebhook as unknown as RequestHandler);

export default configRouter;
