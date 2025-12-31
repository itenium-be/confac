import {Response} from 'express';
import {MessageWebhookRequest, OrderWebhookRequest, validateSignature, WebhookUser} from '../services/billit/webhooks';
import {ConfacRequest} from '../models/technical';
import {syncBillitOrder} from '../services/billit/orders/sync-order';

export const orderCreatedWebhook = async (req: ConfacRequest, res: Response) => {
  const body: OrderWebhookRequest = req.body;
  validateSignature('orderCreated', <string>req.headers['billit-signature'], body);
  req.user = WebhookUser;

  // This is initiated from confac, so we'll ignore this

  return res.status(200).send();
};


export const orderUpdatedWebhook = async (req: ConfacRequest, res: Response) => {
  const body: OrderWebhookRequest = req.body;
  validateSignature('orderUpdated', <string>req.headers['billit-signature'], body);
  req.user = WebhookUser;

  await syncBillitOrder(req, body.UpdatedEntityID);

  return res.status(200).send();
};


export const messageCreatedWebhook = async (req: ConfacRequest, res: Response) => {
  const body: MessageWebhookRequest = req.body;
  validateSignature('messageCreated', <string>req.headers['billit-signature'], body);
  req.user = WebhookUser;

  if (body.EntityDetail?.OrderID) {
    await syncBillitOrder(req, body.EntityDetail.OrderID);
  }

  return res.status(200).send();
};


export const messageUpdatedWebhook = async (req: ConfacRequest, res: Response) => {
  const body: MessageWebhookRequest = req.body;
  validateSignature('messageUpdated', <string>req.headers['billit-signature'], body);
  req.user = WebhookUser;

  if (body.EntityDetail?.OrderID) {
    await syncBillitOrder(req, body.EntityDetail.OrderID);
  }

  return res.status(200).send();
};
