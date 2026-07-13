import {ObjectID} from 'mongodb';
import {SocketServerMock} from 'socket.io-mock-ts';
import {IAudit} from '../../../../models/common';
import {IInvoice, IInvoiceBillit, IInvoiceBillitError} from '../../../../models/invoices';
import {ConfacRequest, Jwt} from '../../../../models/technical';
import {BillitError} from '../../../../services/billit';
import {saveBillitError} from '../save-billit-error';

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

type Update = {$push: {'billit.errors': IInvoiceBillitError}};

/** A db that applies the $push to invoice.billit.errors the way mongo would, and swallows the audit log */
function buildReq(billit?: IInvoiceBillit) {
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
          value: {
            ...invoice,
            billit: {...invoice.billit, errors: [...(invoice.billit?.errors || []), update.$push['billit.errors']]},
          },
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

describe('saveBillitError', () => {
  it('stores the Billit error codes so they outlive the toast', async () => {
    const {req, invoice} = buildReq({orderId: 128275964});
    const error = new BillitError('Failed to send invoice via Peppol', [{
      Code: 'PleaseSupplyAValidPONumberInTheFieldYourReference',
      Description: 'Voor deze klant is een geldig PO of ordernummer nodig',
    }]);

    const result = await saveBillitError(req, invoice, 'sendInvoice', error);

    expect(result?.billit?.errors).toHaveLength(1);
    const [saved] = result!.billit!.errors!;
    expect(saved.operation).toBe('sendInvoice');
    expect(saved.message).toBe('Failed to send invoice via Peppol');
    expect(saved.billitErrors).toEqual([{
      Code: 'PleaseSupplyAValidPONumberInTheFieldYourReference',
      Description: 'Voor deze klant is een geldig PO of ordernummer nodig',
    }]);
  });

  it('appends to the errors already on the invoice', async () => {
    const previous: IInvoiceBillitError = {
      date: '2026-07-13T08:00:00.000Z',
      operation: 'createOrder',
      message: 'Billit was down',
    };
    const {req, invoice} = buildReq({orderId: 128275964, errors: [previous]});

    const result = await saveBillitError(req, invoice, 'sendInvoice', new Error('and now this'));

    expect(result?.billit?.errors).toHaveLength(2);
    expect(result!.billit!.errors![0]).toEqual(previous);
    expect(result!.billit!.errors![1].message).toBe('and now this');
  });

  it('stores an error on an invoice without billit: createOrder never got to write one', async () => {
    const {req, invoice} = buildReq(undefined);

    const result = await saveBillitError(req, invoice, 'createOrder', new Error('Failed to create order at Billit'));

    expect(result?.billit?.errors).toHaveLength(1);
    expect(result!.billit!.errors![0].operation).toBe('createOrder');
  });
});
