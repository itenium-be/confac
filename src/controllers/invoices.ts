import moment from 'moment';
import {Request, Response} from 'express';

import {InvoicesCollection, IInvoice} from '../models/invoices';
import {AttachmentsCollection} from '../models/attachments';
import {createPdf} from './utils';

export const getInvoices = async (req: Request, res: Response) => {
  const invoices = await InvoicesCollection.find();
  return res.send(invoices);
};

export const createInvoice = async (req: Request, res: Response) => {
  const invoice: IInvoice = req.body;

  if (!invoice.isQuotation) {
    const [lastInvoice] = await InvoicesCollection.find({isQuotation: false}).sort({number: -1}).limit(1);

    if (lastInvoice) {
      if (invoice.number <= lastInvoice.number) {
        return res.status(400)
          .send({
            msg: 'invoice.badRequest.nrExists',
            data: {
              nr: invoice.number,
              lastNr: lastInvoice.number,
            },
            reload: false,
          });
      }

      if (moment(invoice.date).startOf('day') < moment(lastInvoice.date).startOf('day')) {
        return res.status(400).send({
          msg: 'invoice.badRequest.dateAfterExists',
          data: {
            lastNr: lastInvoice.number,
            date: moment(invoice.date).format('DD/MM/YYYY'),
            lastDate: moment(lastInvoice.date).format('DD/MM/YYYY'),
          },
        });
      }
    }
  }

  const createdInvoice = await InvoicesCollection.create({
    ...invoice,
    createdOn: new Date().toISOString(),
  });

  const pdfBuffer = await createPdf(invoice);

  await AttachmentsCollection.create({
    _id: createdInvoice._id,
    pdf: pdfBuffer,
  });

  return res.send(createdInvoice);
};
