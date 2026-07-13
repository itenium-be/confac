import {ObjectID} from 'mongodb';
import {SocketServerMock} from 'socket.io-mock-ts';
import {IAudit} from '../../../../models/common';
import {IInvoice, IInvoiceBillit} from '../../../../models/invoices';
import {ConfacRequest, Jwt} from '../../../../models/technical';
import {resetBillitOrder} from '../reset-billit-order';

const fakeUser: Jwt = {
  data: {
    _id: '_id',
    email: 'user@itenium.be',
    firstName: 'Wouter',
    name: 'Wouter',
    alias: 'Wouter',
    active: true,
  },
  iat: 0,
  exp: 0,
};

type Update = {$set: Partial<IInvoice>};

/** A db that applies the $set the way mongo would, and swallows the audit log */
function buildReq(billit: IInvoiceBillit) {
  const invoice = {
    _id: new ObjectID(),
    number: 2737,
    status: 'ToSend',
    audit: {} as IAudit,
    billit,
  } as IInvoice;

  const db = {
    collection: (colName: string) => {
      if (colName === 'logs_audit') {
        return {insertOne: () => Promise.resolve({})};
      }
      return {
        findOneAndUpdate: (_filter: unknown, update: Update) => Promise.resolve({
          ok: 1,
          value: {...invoice, ...update.$set},
        }),
      };
    },
  };

  const req = {
    user: fakeUser,
    db,
    io: new SocketServerMock() as unknown as ConfacRequest['io'],
    headers: {},
  } as unknown as ConfacRequest;

  return {req, invoice};
}

describe('resetBillitOrder', () => {
  it('puts the invoice back to Draft so it becomes editable again', async () => {
    const {req, invoice} = buildReq({orderId: 128275964});

    const result = await resetBillitOrder(req, invoice);

    expect(result?.status).toBe('Draft');
  });

  it('drops the orderId: it points at an order that no longer exists at Billit', async () => {
    const {req, invoice} = buildReq({
      orderId: 128275964,
      delivery: {date: '', info: '', delivered: false, status: 'Failed'},
      messages: [],
      errors: [{date: '', operation: 'sendInvoice', message: 'PO number missing'}],
    });

    const result = await resetBillitOrder(req, invoice);

    expect(result?.billit?.orderId).toBeUndefined();
    expect(result?.billit?.delivery).toBeUndefined();
    expect(result?.billit?.messages).toBeUndefined();
    expect(result?.billit?.errors).toBeUndefined();
  });

  it('bumps the attempt, so the next send does not replay the same idempotency key', async () => {
    const {req, invoice} = buildReq({orderId: 128275964});

    const result = await resetBillitOrder(req, invoice);

    expect(result?.billit?.attempt).toBe(1);
  });

  it('keeps counting across repeated deletes', async () => {
    const {req, invoice} = buildReq({orderId: 128275964, attempt: 2});

    const result = await resetBillitOrder(req, invoice);

    expect(result?.billit?.attempt).toBe(3);
  });
});
