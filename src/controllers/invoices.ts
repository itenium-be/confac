import moment from 'moment';
import {Request, Response} from 'express';
import PDFMerge from 'pdf-merge';
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import tmp from 'tmp';

import {InvoicesCollection, IInvoice} from '../models/invoices';
import {AttachmentsCollection, IAttachment, ISendGridAttachment} from '../models/attachments';
import {createPdf} from './utils';
import {IEmail} from '../models/clients';

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

  const pdfBuffer = await createPdf(invoice);

  if (!Buffer.isBuffer(pdfBuffer) && pdfBuffer.error) {
    return res.status(500).send(pdfBuffer.error);
  }

  const createdInvoice = await InvoicesCollection.create({
    ...invoice,
    createdOn: new Date().toISOString(),
  });

  await AttachmentsCollection.create({
    _id: createdInvoice._id,
    pdf: pdfBuffer,
  });

  return res.send(createdInvoice);
};

export const emailInvoice = async (req: Request, res: Response) => {
  const invoiceId = req.params.id;
  const {attachments, combineAttachments, ...email}: IEmail = req.body;

  const attachmentTypes = attachments.map(a => a.type).join(' ');
  const attachmentBuffers = await AttachmentsCollection.findById({_id: invoiceId}, attachmentTypes);

  let sendGridAttachments: ISendGridAttachment[] = [];

  if (attachmentBuffers) {
    if (combineAttachments) {
      const areAttachmentsMergeable = attachments.every(attachment => attachment.fileType === 'application/pdf');

      if (!areAttachmentsMergeable) {
        res.status(400).send('Emailing with combineAttachments=true: Can only merge pdfs');
      }

      // Make sure the invoice is the first document in the merged pdf
      // eslint-disable-next-line no-nested-ternary
      const sortedAttachments = attachments.sort((a, b) => (a.type === 'pdf' ? -1 : b.type === 'pdf' ? 1 : 0));

      const files: tmp.FileResult[] = [];
      sortedAttachments.forEach(attachment => {
        const tmpFile = tmp.fileSync();
        fs.writeSync(tmpFile.fd, attachmentBuffers[attachment.type as keyof IAttachment].buffer);
        files.push(tmpFile);
      });

      const buffer: Buffer = await PDFMerge(files.map(f => f.name));

      const invoiceAttachment = sortedAttachments.find(attachment => attachment.type === 'pdf');

      if (invoiceAttachment) {
        sendGridAttachments = [{
          content: buffer.toString('base64'),
          filename: invoiceAttachment.fileName,
          type: invoiceAttachment.fileType as string,
          disposition: 'attachment',
        }];
      }
      files.forEach(file => file.removeCallback());

    } else {
      sendGridAttachments = attachments.map(attachment => ({
        content: attachmentBuffers[attachment.type].toString('base64'),
        filename: attachment.fileName,
        type: attachment.fileType,
        disposition: 'attachment',
      }));
    }
  }

  const mailData = {
    to: email.to.split(';'),
    cc: email.cc?.split(';'),
    bcc: email.bcc?.split(';'),
    from: email.from as string,
    subject: email.subject,
    // text: '', // TODO: Send body stripped from html?
    html: email.body,
    attachments: sendGridAttachments,
  };

  try {
    await sgMail.send(mailData, false).then(() => { console.log('Mail sent successfully'); });
  } catch (error) {
    if (error.code === 401) {
      res.status(400).send({message: 'Has the SendGrid API Key been set?'});
    } else {
      res.status(400).send(error.response.body.errors);
    }
  }

  const lastEmailSent = new Date().toISOString();
  await InvoicesCollection.findByIdAndUpdate({_id: invoiceId}, {lastEmail: lastEmailSent});

  res.status(200).send(lastEmailSent);
}
 
export const deleteInvoice = async (req: Request, res: Response) => {
  const {id}: {id: string;} = req.body;

  await InvoicesCollection.findByIdAndRemove(id);
  await AttachmentsCollection.findByIdAndRemove(id);

  return res.send(id);
};

export const previewPdfInvoice = async (req: Request, res: Response) => {
  const invoice: IInvoice = req.body;

  const pdfBuffer = await createPdf(invoice);

  if (!Buffer.isBuffer(pdfBuffer) && pdfBuffer.error) {
    return res.status(500).send(pdfBuffer.error);
  }

  res.type('application/pdf').send(pdfBuffer);
};
