import {ObjectID} from 'mongodb';
import diff from 'deep-diff';
import {IInvoice, IInvoiceBillit, InvoiceStatus} from '../../../models/invoices';
import {CollectionNames, SocketEventTypes, updateAudit} from '../../../models/common';
import {ConfacRequest} from '../../../models/technical';
import {emitEntityEvent} from '../../../controllers/utils/entity-events';
import {saveAudit} from '../../../controllers/utils/audit-logs';
import {logger} from '../../../logger';
import {ApiClientFactory} from '../../../controllers/utils/billit';
import config from '../../../config';
import {BillitOrder, BillitOrderStatus} from './createorder';

/** Fetch the Order from Billit and sync with our Invoice */
export async function syncBillitOrder(req: ConfacRequest, billitOrderId: number): Promise<IInvoice | null> {
  const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOne({'billit.orderId': billitOrderId});

  if (!invoice) {
    logger.error(`syncBillitOrder: No invoice found for billitOrderId=${billitOrderId}`);
    return null;
  }

  const apiClient = ApiClientFactory.fromConfig(config);
  const billitOrder = await apiClient.getOrder(billitOrderId);

  const newStatus = mapBillitStatusToInvoiceStatus(billitOrder.OrderStatus);
  const newBillit = mapBillitOrderToInvoiceBillit(billitOrder);

  const statusChanged = invoice.status !== newStatus;
  const billitChanged = !!diff(invoice.billit, newBillit);

  if (!statusChanged && !billitChanged) {
    logger.info(`syncBillitOrder: No changes for invoice #${invoice.number}`);
    return invoice;
  }

  if (statusChanged) {
    logger.info(`syncBillitOrder: Updating invoice #${invoice.number} status from ${invoice.status} to ${newStatus}`);
  }

  const updatedAudit = updateAudit(invoice.audit, req.user);
  const updatedInvoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOneAndUpdate(
    {_id: new ObjectID(invoice._id)},
    {$set: {status: newStatus, billit: newBillit, audit: updatedAudit}},
    {returnDocument: 'after'},
  );

  if (updatedInvoice.ok && updatedInvoice.value) {
    await saveAudit(req, 'invoice', invoice, updatedInvoice.value);

    emitEntityEvent(
      req,
      SocketEventTypes.EntityUpdated,
      CollectionNames.INVOICES,
      updatedInvoice.value._id,
      updatedInvoice.value,
      'everyone',
    );
    return updatedInvoice.value;
  }

  return null;
}


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

function mapBillitOrderToInvoiceBillit(billitOrder: BillitOrder): IInvoiceBillit {
  return {
    orderId: billitOrder.OrderID,
    delivery: billitOrder.CurrentDocumentDeliveryDetails ? {
      date: billitOrder.CurrentDocumentDeliveryDetails.DocumentDeliveryDate,
      info: billitOrder.CurrentDocumentDeliveryDetails.DocumentDeliveryInfo,
      delivered: billitOrder.CurrentDocumentDeliveryDetails.IsDocumentDelivered,
      status: billitOrder.CurrentDocumentDeliveryDetails.DocumentDeliveryStatus,
    } : undefined,
    messages: billitOrder.Messages?.map(msg => ({
      description: msg.Description,
      fileId: msg.FileID,
      creationDate: msg.CreationDate,
      transportType: msg.TransportType,
      success: msg.Success,
      trials: msg.Trials,
      destination: msg.Destination,
      messageDirection: msg.MessageDirection,
    })),
  };
}
