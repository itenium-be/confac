import {ObjectID} from 'mongodb';
import {CollectionNames, SocketEventTypes, updateAudit} from '../../../models/common';
import {IInvoice, IInvoiceBillit} from '../../../models/invoices';
import {ConfacRequest} from '../../../models/technical';
import {saveAudit} from '../audit-logs';
import {emitEntityEvent} from '../entity-events';

/**
 * Puts an invoice back to Draft after its order was deleted at Billit.
 * Everything but the attempt is dropped: orderId, delivery and messages all describe
 * an order that no longer exists. The errors live on in the audit log.
 */
export async function resetBillitOrder(req: ConfacRequest, invoice: IInvoice): Promise<IInvoice | null> {
  const billit: IInvoiceBillit = {attempt: (invoice.billit?.attempt || 0) + 1};
  const audit = updateAudit(invoice.audit, req.user);

  const updated = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOneAndUpdate(
    {_id: new ObjectID(invoice._id)},
    {$set: {status: 'Draft', billit, audit}},
    {returnDocument: 'after'},
  );

  if (!updated.ok || !updated.value) {
    return null;
  }

  await saveAudit(req, 'invoice', invoice, updated.value);
  emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, updated.value._id, updated.value, 'everyone');

  return updated.value;
}
