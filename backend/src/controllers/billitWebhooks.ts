import {Request, Response} from 'express';
import {MessageWebhookRequest, OrderWebhookRequest, validateSignature} from '../services/billit/webhooks';

export const orderCreatedWebhook = async (req: Request, res: Response) => {
  const body: OrderWebhookRequest = req.body;
  validateSignature('orderCreated', <string>req.headers['billit-signature'], body);

  return res.status(200).send();
};


export const orderUpdatedWebhook = async (req: Request, res: Response) => {
  const body: OrderWebhookRequest = req.body;
  validateSignature('orderUpdated', <string>req.headers['billit-signature'], body);

  return res.status(200).send();
};


export const messageCreatedWebhook = async (req: Request, res: Response) => {
  const body: MessageWebhookRequest = req.body;
  validateSignature('messageCreated', <string>req.headers['billit-signature'], body);

  return res.status(200).send();
};


export const messageUpdatedWebhook = async (req: Request, res: Response) => {
  const body: MessageWebhookRequest = req.body;
  validateSignature('messageUpdated', <string>req.headers['billit-signature'], body);

  return res.status(200).send();
};
