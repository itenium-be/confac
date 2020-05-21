import moment from 'moment';
import {Request, Response} from 'express';
import PDFMerge from 'pdf-merge';
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import tmp from 'tmp';
import {ObjectID, Db} from 'mongodb';
import {IInvoice, INVOICE_EXCEL_HEADERS} from '../models/invoices';
import {IAttachmentCollection, ISendGridAttachment} from '../models/attachments';
import {createPdf} from './utils';
import {IEmail} from '../models/clients';
import {CollectionNames, IAttachment, createAudit, updateAudit} from '../models/common';
import {IProjectMonth} from '../models/projectsMonth';
import {ConfacRequest, Jwt} from '../models/technical';


const createInvoice = async (invoice: IInvoice, db: Db, pdfBuffer: Buffer, user: Jwt) => {
  const inserted = await db.collection<IInvoice>(CollectionNames.INVOICES).insertOne({
    ...invoice,
    audit: createAudit(user),
  });

  const [createdInvoice] = inserted.ops;

  await db.collection<Pick<IAttachmentCollection, '_id' | 'pdf' >>(CollectionNames.ATTACHMENTS).insertOne({
    _id: new ObjectID(createdInvoice._id),
    pdf: pdfBuffer,
  });

  return createdInvoice;
};



const moveProjectMonthAttachmentsToInvoice = async (invoice: IInvoice, projectMonthId: ObjectID, db: Db) => {
  const projectMonthAttachments: IAttachmentCollection | null = await db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH)
    .findOne({_id: projectMonthId}, {projection: {_id: false}});

  if (projectMonthAttachments) {
    await db.collection(CollectionNames.ATTACHMENTS).findOneAndUpdate({_id: invoice._id}, {$set: {...projectMonthAttachments}});
  }

  const projectMonth = await db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).findOne({_id: projectMonthId});
  const updatedAttachmentDetails = projectMonth ? [...invoice.attachments, ...projectMonth?.attachments] : invoice.attachments;

  const inserted = await db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(invoice._id)}, {$set: {attachments: updatedAttachmentDetails}}, {returnOriginal: false});
  const updatedInvoice = inserted.value;

  await db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).findOneAndUpdate({_id: projectMonthId}, {$set: {attachments: []}});
  await db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).findOneAndDelete({_id: projectMonthId});

  return updatedInvoice;
};


export const getInvoicesController = async (req: Request, res: Response) => {
  const invoices = await req.db.collection(CollectionNames.INVOICES).find().toArray();
  return res.send(invoices);
};



export const createInvoiceController = async (req: ConfacRequest, res: Response) => {
  const invoice: IInvoice = req.body;

  if (!invoice.isQuotation) {
    const [lastInvoice] = await req.db.collection<IInvoice>(CollectionNames.INVOICES).find({isQuotation: false})
      .sort({number: -1})
      .limit(1)
      .toArray();

    if (lastInvoice) {
      if (invoice.number <= lastInvoice.number) {
        return res.status(400)
          .send({
            message: 'invoice.badRequest.nrExists',
            data: {
              nr: invoice.number,
              lastNr: lastInvoice.number,
            },
            reload: false,
          });
      }

      if (moment(invoice.date).startOf('day') < moment(lastInvoice.date).startOf('day')) {
        return res.status(400).send({
          message: 'invoice.badRequest.dateAfterExists',
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

  const createdInvoice = await createInvoice(invoice, req.db, pdfBuffer as Buffer, req.user);

  if (invoice.projectMonthId) {
    const projectMonthId = new ObjectID(invoice.projectMonthId);
    const updatedInvoice = await moveProjectMonthAttachmentsToInvoice(createdInvoice, projectMonthId, req.db);

    return res.send(updatedInvoice);
  }

  return res.send(createdInvoice);
};



export const emailInvoiceController = async (req: Request, res: Response) => {
  const invoiceId = req.params.id;
  const {attachments, combineAttachments, ...email}: IEmail = req.body;

  const attachmentTypes = attachments.map(a => a.type).reduce((acc: { [key: string]: number; }, cur) => {
    acc[cur] = 1;
    return acc;
  }, {});
  const attachmentBuffers: IAttachmentCollection | null = await req.db.collection(CollectionNames.ATTACHMENTS)
    .findOne({_id: new ObjectID(invoiceId)}, attachmentTypes);

  let sendGridAttachments: ISendGridAttachment[] = [];

  if (attachmentBuffers) {
    if (combineAttachments) {
      const areAttachmentsMergeable = attachments.every(attachment => attachment.fileType === 'application/pdf');

      if (!areAttachmentsMergeable) {
        return res.status(400).send({message: 'Emailing with combineAttachments=true: Can only merge pdfs'});
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
    await sgMail.send(mailData, false).then(() => {
      // eslint-disable-next-line
      console.log(`Mail sent successfully to ${mailData.to}. Subject=${mailData.subject}`);
    });
  } catch (error) {
    if (error.code === 401) {
      // eslint-disable-next-line
      console.log('SendGrid returned 401. API key not set?');
      return res.status(400).send({message: 'Has the SendGrid API Key been set?'});
    }

    // eslint-disable-next-line
    console.log('SendGrid returned an error', error.response.body);
    return res.status(400).send(error.response.body.errors[0]);
  }

  const lastEmailSent = new Date().toISOString();
  await req.db.collection(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(invoiceId)}, {$set: {lastEmail: lastEmailSent}});

  return res.status(200).send(lastEmailSent);
};



/** Update an existing invoice */
export const updateInvoiceController = async (req: ConfacRequest, res: Response) => {
  const {_id, ...invoice}: IInvoice = req.body;

  invoice.audit = updateAudit(invoice.audit, req.user);

  const updatedPdfBuffer = await createPdf({
    _id,
    ...invoice,
  });

  if (!Buffer.isBuffer(updatedPdfBuffer) && updatedPdfBuffer.error) {
    return res.status(500).send(updatedPdfBuffer.error);
  }

  if (Buffer.isBuffer(updatedPdfBuffer)) {
    await req.db.collection<IAttachment>(CollectionNames.ATTACHMENTS)
      .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {pdf: updatedPdfBuffer}});
  }

  const inserted = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: invoice}, {returnOriginal: false});
  const updatedInvoice = inserted.value;

  let projectMonth;
  if (updatedInvoice?.projectMonthId) {
    // TODO: This should be a separate route once security is implemented
    // Right now it is always updating the projectMonth.verified but this only changes when the invoice.verified changes
    projectMonth = await req.db.collection(CollectionNames.PROJECTS_MONTH)
      .findOneAndUpdate({_id: new ObjectID(invoice.projectMonthId)}, {$set: {verified: updatedInvoice.verified}});
  }

  const result: Array<any> = [{
    type: 'invoice',
    model: updatedInvoice,
  }];
  if (projectMonth && projectMonth.ok) {
    result.push({
      type: 'projectMonth',
      model: projectMonth.value,
    });
  }

  return res.send(result);
};



/** Hard invoice delete: There is no coming back from this one */
export const deleteInvoiceController = async (req: Request, res: Response) => {
  const {id: invoiceId}: {id: string;} = req.body;

  const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOne({_id: new ObjectID(invoiceId)});

  if (invoice?.projectMonthId) {
    const invoiceAttachments: IAttachmentCollection | null = await req.db.collection(CollectionNames.ATTACHMENTS)
      .findOne({_id: new ObjectID(invoiceId) as ObjectID}, {
        projection: {
          _id: false,
          pdf: false,
        },
      });

    await req.db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).insertOne({
      _id: new ObjectID(invoice.projectMonthId),
      ...invoiceAttachments,
    });

    const projectMonthCollection = req.db.collection(CollectionNames.PROJECTS_MONTH);
    const attachments = invoice.attachments.filter(a => a.type !== 'pdf');
    await projectMonthCollection.findOneAndUpdate({_id: new ObjectID(invoice.projectMonthId)}, {$set: {attachments}});
  }

  await req.db.collection(CollectionNames.INVOICES).findOneAndDelete({_id: new ObjectID(invoiceId)});
  await req.db.collection(CollectionNames.ATTACHMENTS).findOneAndDelete({_id: new ObjectID(invoiceId)});

  return res.send(invoiceId);
};



/** Open the invoice pdf in the browser in a new tab */
export const previewPdfInvoiceController = async (req: Request, res: Response) => {
  const invoice: IInvoice = req.body;

  const pdfBuffer = await createPdf(invoice);

  if (!Buffer.isBuffer(pdfBuffer) && pdfBuffer.error) {
    return res.status(500).send(pdfBuffer.error);
  }

  return res.type('application/pdf').send(pdfBuffer);
};



/** Create simple CSV output of the invoice._ids passed in the body */
export const generateExcelForInvoicesController = async (req: Request, res: Response) => {
  const invoiceIds: ObjectID[] = req.body.map((invoiceId: string) => new ObjectID(invoiceId));

  const invoices = await req.db.collection<IInvoice>(CollectionNames.INVOICES).find({_id: {$in: invoiceIds}})
    .toArray();

  const separator = ';';

  const excelHeader = `${INVOICE_EXCEL_HEADERS.join(separator)}\r\n`;

  const excelBody = `${invoices.map(invoice => ([
    invoice.number,
    moment(invoice.date).format('YYYY-MM-DD'),
    invoice.client.name,
    invoice.orderNr,
    invoice.money.totalWithoutTax.toString().replace('.', ','),
    invoice.money.totalTax.toString().replace('.', ','),
    invoice.money.total.toString().replace('.', ','),
    invoice.verified,
    invoice.money.discount!.toString().replace('.', ','),
    `"${invoice.lines[0].desc}"`,
    invoice._id,
  ].join(separator))).join('\r\n')}`;

  const excel = `${excelHeader}${excelBody}`;

  return res.send(excel);
};
