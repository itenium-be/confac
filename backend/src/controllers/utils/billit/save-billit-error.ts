import {ObjectID, UpdateQuery} from 'mongodb';
import {CollectionNames, SocketEventTypes, updateAudit} from '../../../models/common';
import {BillitOperation, IInvoice, IInvoiceBillitError} from '../../../models/invoices';
import {ConfacRequest} from '../../../models/technical';
import {BillitErrorFactory} from '../../../services/billit';
import {saveAudit} from '../audit-logs';
import {emitEntityEvent} from '../entity-events';

/**
 * Persists a Billit send failure on the invoice so it outlives the toast.
 * The send request itself answers 500, so the socket event is what gets the error
 * to the frontend store: it goes to everyone, incl. the user whose send just failed.
 */
export async function saveBillitError(
  req: ConfacRequest,
  invoice: IInvoice,
  operation: BillitOperation,
  error: unknown,
): Promise<IInvoice | null> {
  const billitError: IInvoiceBillitError = BillitErrorFactory.toInvoiceError(operation, error);
  const audit = updateAudit(invoice.audit, req.user);

  // $push creates billit when createOrder failed before ever writing one.
  // Cast: the mongodb 3.x PushOperator only types top-level array keys, not dotted paths
  const update = {
    $push: {'billit.errors': billitError},
    $set: {audit},
  } as unknown as UpdateQuery<IInvoice>;

  const updated = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOneAndUpdate(
    {_id: new ObjectID(invoice._id)},
    update,
    {returnDocument: 'after'},
  );

  if (!updated.ok || !updated.value) {
    return null;
  }

  await saveAudit(req, 'invoice', invoice, updated.value);
  emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, updated.value._id, updated.value, 'everyone');

  return updated.value;
}
