import moment from 'moment';
import {Request, Response} from 'express';
import {ObjectID, Db} from 'mongodb';
import {IInvoice, INVOICE_EXCEL_HEADERS} from '../models/invoices';
import {IAttachmentCollection} from '../models/attachments';
import {createPdf, createXml} from './utils';
import {CollectionNames, IAttachment, SocketEventTypes, createAudit, updateAudit} from '../models/common';
import {IProjectMonth} from '../models/projectsMonth';
import {ConfacRequest, Jwt} from '../models/technical';
import {saveAudit} from './utils/audit-logs';
import {emitEntityEvent} from './utils/entity-events';


const createInvoice = async (invoice: IInvoice, db: Db, pdfBuffer: Buffer, user: Jwt) => {
  const inserted = await db.collection<IInvoice>(CollectionNames.INVOICES).insertOne({
    ...invoice,
    audit: createAudit(user),
  });

  const [createdInvoice] = inserted.ops;


  if (!invoice.isQuotation) {
    const xmlBuffer = Buffer.from(createXml(createdInvoice, pdfBuffer));
    await db.collection<Pick<IAttachmentCollection, '_id' | 'pdf' | 'xml'>>(CollectionNames.ATTACHMENTS).insertOne({
      _id: new ObjectID(createdInvoice._id),
      pdf: pdfBuffer,
      xml: xmlBuffer
    });
  } else {
    await db.collection<Pick<IAttachmentCollection, '_id' | 'pdf'>>(CollectionNames.ATTACHMENTS).insertOne({
      _id: new ObjectID(createdInvoice._id),
      pdf: pdfBuffer
    });
  }

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

  const updateInvoiceResult = await db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(invoice._id)}, {$set: {attachments: updatedAttachmentDetails}}, {returnOriginal: false});
  const updatedInvoice = updateInvoiceResult.value;

  const updateProjectMonthResult = await db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).findOneAndUpdate({_id: projectMonthId}, {$set: {attachments: []}});
  const updatedProjectMonth = updateProjectMonthResult.value;

  await db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).findOneAndDelete({_id: projectMonthId});

  return {updatedInvoice, updatedProjectMonth};
};


export const getInvoicesController = async (req: Request<void, void, void, {months: number}>, res: Response) => {
  const getFrom = moment().subtract(req.query.months, 'months').startOf('month').format('YYYY-MM-DD');
  const invoices = await req.db.collection(CollectionNames.INVOICES)
    .find({date: {$gte: getFrom}})
    .toArray();
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

  let createdInvoice = await createInvoice(invoice, req.db, pdfBuffer as Buffer, req.user);

  if (invoice.projectMonth) {
    const projectMonthId = new ObjectID(invoice.projectMonth.projectMonthId);
    const {updatedInvoice, updatedProjectMonth} = await moveProjectMonthAttachmentsToInvoice(createdInvoice, projectMonthId, req.db);
    if (updatedProjectMonth) {
      emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.PROJECTS_MONTH, updatedProjectMonth!._id, updatedProjectMonth);
    }
    createdInvoice = updatedInvoice!;
  }

  emitEntityEvent(req, SocketEventTypes.EntityCreated, CollectionNames.INVOICES, createdInvoice._id, createdInvoice);


  if (invoice.creditNotas?.length) {
    const linkedInvoiceIds = invoice.creditNotas.map(id => new ObjectID(id));
    const linkedInvoices = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
      .find({_id: {$in: linkedInvoiceIds}})
      .toArray();

    await req.db.collection<IInvoice>(CollectionNames.INVOICES).updateMany(
      {_id: {$in: linkedInvoiceIds}},
      {$push: {creditNotas: createdInvoice._id.toString()}}
    );

    linkedInvoices.forEach(invoice => {
      invoice.creditNotas = [...(invoice.creditNotas || []), createdInvoice._id];
      emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, invoice._id, invoice, 'everyone');
    });
  }

  return res.send(createdInvoice);
};



/** Update an existing invoice */
export const updateInvoiceController = async (req: ConfacRequest, res: Response) => {
  const {_id, ...invoice}: IInvoice = req.body;

  invoice.audit = updateAudit(invoice.audit, req.user);
  const updatedPdfBuffer = await createPdf({_id, ...invoice});

  if (!Buffer.isBuffer(updatedPdfBuffer) && updatedPdfBuffer.error) {
    return res.status(500).send(updatedPdfBuffer.error);
  }

  if (Buffer.isBuffer(updatedPdfBuffer)) {
    await req.db.collection<IAttachment>(CollectionNames.ATTACHMENTS)
      .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {pdf: updatedPdfBuffer}});
  }

  if (!invoice.isQuotation) {
    const updateXmlBuffer = Buffer.from(createXml({_id, ...invoice}, updatedPdfBuffer as Buffer));
    await req.db.collection<IAttachment>(CollectionNames.ATTACHMENTS)
      .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {xml: updateXmlBuffer}});
  }

  if (!invoice.projectMonth) {
    // Makes sure projectMonth is overwritten in the db if already present there
    invoice.projectMonth = undefined;
  }

  const {value: originalInvoice} = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: invoice}, {returnOriginal: true});

  // Fix diff
  if (!invoice.projectMonth) {
    delete invoice.projectMonth;
  }
  if (originalInvoice && !originalInvoice?.projectMonth) {
    delete originalInvoice.projectMonth;
  }
  await saveAudit(req, 'invoice', originalInvoice, invoice, ['projectMonth.consultantId']);

  const invoiceResponse = {_id, ...invoice};
  const result: Array<any> = [{
    type: 'invoice',
    model: invoiceResponse,
  }];
  emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, invoiceResponse._id, invoiceResponse);

  return res.send(result);
};



export const verifyInvoiceController = async (req: ConfacRequest, res: Response) => {
  const {id, verified}: { id: string; verified: boolean; } = req.body;

  const saveResult = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(id)}, {$set: {verified}}, {returnOriginal: true});

  if (!saveResult?.value) {
    return res.status(404).send('Invoice not found');
  }

  if (saveResult.value.verified === verified) {
    return res.status(200).send();
  }

  const originalInvoice = saveResult.value;
  const invoice = {...originalInvoice, verified};
  await saveAudit(req, 'invoice', originalInvoice, invoice);

  const result: Array<any> = [{
    type: 'invoice',
    model: invoice,
  }];

  emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, invoice._id, invoice);

  if (invoice?.projectMonth?.projectMonthId) {
    let shouldUpdateProjectMonth = true;
    if (verified && invoice.creditNotas?.length) {
      const creditNotes = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
        .find({_id: {$in: invoice.creditNotas.map(id => new ObjectID(id))}})
        .toArray();

      shouldUpdateProjectMonth = creditNotes.every(creditNote => creditNote.verified);
    }

    if (shouldUpdateProjectMonth) {
      const projectMonth = await req.db.collection(CollectionNames.PROJECTS_MONTH)
        .findOneAndUpdate({_id: new ObjectID(invoice.projectMonth.projectMonthId)}, {$set: {verified}}, {returnOriginal: false});

      emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.PROJECTS_MONTH, invoice.projectMonth.projectMonthId, projectMonth.value);

      result.push({
        type: 'projectMonth',
        model: projectMonth.value,
      });
    }
  }

  return res.status(200).send(result);
};



/** Hard invoice delete: There is no coming back from this one */
export const deleteInvoiceController = async (req: ConfacRequest, res: Response) => {
  const { id: invoiceId }: { id: string; } = req.body;

  const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOne({ _id: new ObjectID(invoiceId) });

  if (invoice?.projectMonth) {
    const invoiceAttachments: IAttachmentCollection | null = await req.db.collection(CollectionNames.ATTACHMENTS)
      .findOne({ _id: new ObjectID(invoiceId) as ObjectID }, {
        projection: {
          _id: false,
          pdf: false,
        },
      });

    if (invoiceAttachments !== null && Object.keys(invoiceAttachments).length > 0) {
      await req.db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).updateOne({ _id: new ObjectID(invoice.projectMonth.projectMonthId) }, {
        $set: { ...invoiceAttachments }
      }, {
        upsert: true
      });
    }

    const projectMonthCollection = req.db.collection(CollectionNames.PROJECTS_MONTH);
    const attachments = invoice.attachments.filter(a => a.type !== 'pdf');

    const projectMonthId = new ObjectID(invoice.projectMonth.projectMonthId);
    const updateProjectMonthResult = await projectMonthCollection.findOneAndUpdate({ _id: projectMonthId }, { $set: { attachments } });
    const updatedProjectMonth = updateProjectMonthResult.value;
    if (updatedProjectMonth) {
      emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.PROJECTS_MONTH, updatedProjectMonth._id, updatedProjectMonth);
    }
  }

  if (invoice?.creditNotas?.length) {
    const linkedInvoiceIds = invoice.creditNotas.map(id => new ObjectID(id));
    const linkedInvoices = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
      .find({_id: {$in: linkedInvoiceIds}})
      .toArray();

    await req.db.collection<IInvoice>(CollectionNames.INVOICES).updateMany(
      {_id: {$in: linkedInvoiceIds}},
      {$pull: {creditNotas: invoice._id.toString()}}
    );

    linkedInvoices.forEach(toUpdate => {
      toUpdate.creditNotas = toUpdate.creditNotas.filter(x => x !== invoice._id.toString());
      emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, toUpdate._id, toUpdate, 'everyone');
    });
  }

  await req.db.collection(CollectionNames.INVOICES).findOneAndDelete({ _id: new ObjectID(invoiceId) });
  await req.db.collection(CollectionNames.ATTACHMENTS).findOneAndDelete({ _id: new ObjectID(invoiceId) });
  emitEntityEvent(req, SocketEventTypes.EntityDeleted, CollectionNames.INVOICES, new ObjectID(invoiceId), null);

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


export const getInvoiceXmlController = async (req: Request, res: Response) => {
  const {id} = req.params;
  const invoiceAttachments: IAttachmentCollection | null = await req.db.collection(CollectionNames.ATTACHMENTS)
    .findOne({_id: new ObjectID(id)});
  if (invoiceAttachments && invoiceAttachments.xml) {
    return res.type('application/xml').send(invoiceAttachments.xml.toString());
  } else {
    return res.status(500).send('No xml found');
  }
};
