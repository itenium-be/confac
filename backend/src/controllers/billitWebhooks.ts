import {Request, Response} from 'express';
import {ObjectID} from 'mongodb';
import {MessageWebhookRequest, OrderWebhookRequest, validateSignature, WebhookUser} from '../services/billit/webhooks';
import {ApiClientFactory} from './utils/billit';
import config from '../config';
import {IInvoice, InvoiceStatus} from '../models/invoices';
import {CollectionNames, SocketEventTypes, updateAudit} from '../models/common';
import {ConfacRequest} from '../models/technical';
import {emitEntityEvent} from './utils/entity-events';
import {logger} from '../logger';
import {BillitOrderStatus} from '../services/billit';

function mapBillitStatusToInvoiceStatus(billitStatus: BillitOrderStatus): InvoiceStatus {
  switch (billitStatus) {
    case 'Draft':
      return 'Draft';
    case 'ToSend':
      return 'ToSend';
    case 'ToPay':
      return 'ToPay';
    case 'Paid':
      return 'Paid';
    default:
      return 'ToPay';
  }
}

export const orderCreatedWebhook = async (req: Request, res: Response) => {
  const body: OrderWebhookRequest = req.body;
  validateSignature('orderCreated', <string>req.headers['billit-signature'], body);

  // This is initiated from confac, so we'll ignore this

  return res.status(200).send();
};


export const orderUpdatedWebhook = async (req: ConfacRequest, res: Response) => {
  const body: OrderWebhookRequest = req.body;
  validateSignature('orderUpdated', <string>req.headers['billit-signature'], body);
  req.user = WebhookUser;

  const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOne({'billit.orderId': body.UpdatedEntityID});

  if (!invoice) {
    logger.error(`Billit Webhook: No invoice found for billitOrderId=${body.UpdatedEntityID}`);
    return res.status(200).send();
  }

  const apiClient = ApiClientFactory.fromConfig(config);
  const billitOrder = await apiClient.getOrder(body.UpdatedEntityID);

  const newStatus = mapBillitStatusToInvoiceStatus(billitOrder.OrderStatus);
  if (invoice.status !== newStatus) {
    logger.info(`orderUpdatedWebhook: Updating invoice #${invoice.number} status from ${invoice.status} to ${newStatus}`);

    const updatedAudit = updateAudit(invoice.audit, req.user);
    // TODO: also add a logs_audit record
    const updatedInvoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOneAndUpdate(
      {_id: new ObjectID(invoice._id)},
      {$set: {status: newStatus, audit: updatedAudit}},
      {returnDocument: 'after'},
    );

    if (updatedInvoice.ok && updatedInvoice.value) {
      emitEntityEvent(
        req,
        SocketEventTypes.EntityUpdated,
        CollectionNames.INVOICES,
        updatedInvoice.value._id,
        updatedInvoice.value,
        'everyone',
      );
    }
  }

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
