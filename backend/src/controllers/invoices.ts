import {Request, Response} from 'express';
import {ObjectID, Db} from 'mongodb';
import moment from 'moment';
import {IInvoice, INVOICE_EXCEL_HEADERS} from '../models/invoices';
import {IAttachmentCollection} from '../models/attachments';
import {createPdf} from './utils';
import {CollectionNames, createAudit, IAttachment, SocketEventTypes, updateAudit} from '../models/common';
import {IProjectMonth} from '../models/projectsMonth';
import {ConfacRequest, Jwt} from '../models/technical';
import {IClient} from '../models/clients';
import {saveAudit} from './utils/audit-logs';
import {emitEntityEvent} from './utils/entity-events';
import config from '../config';
import {logger} from '../logger';
import {ApiClient, Attachment, BillitError, CreateOrderRequest, SendInvoiceRequest} from '../services/billit';
import {GetParticipantInformationResponse} from '../services/billit/peppol/getparticipantinformation';
import {ApiClientFactory, CreateOrderRequestFactory, SendInvoiceRequestFactory, VatNumberFactory} from './utils/billit';
import {IProject} from '../models/projects';
import {syncBillitOrder} from '../services/billit/orders/sync-order';

const createInvoice = async (invoice: IInvoice, db: Db, pdfBuffer: Buffer, user: Jwt) => {
  const inserted = await db.collection<IInvoice>(CollectionNames.INVOICES).insertOne({
    ...invoice,
    audit: createAudit(user),
  });

  const [createdInvoice] = inserted.ops;
  await db.collection<Pick<IAttachmentCollection, '_id' | 'pdf'>>(CollectionNames.ATTACHMENTS).insertOne({
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
  const updatedAttachmentDetails = projectMonth ? [...invoice.attachments, ...projectMonth.attachments] : invoice.attachments;

  const updateInvoiceResult = await db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(invoice._id)}, {$set: {attachments: updatedAttachmentDetails}}, {returnOriginal: false});
  const updatedInvoice = updateInvoiceResult.value;

  const updateProjectMonthResult = await db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH)
    .findOneAndUpdate({_id: projectMonthId}, {$set: {attachments: []}});
  const updatedProjectMonth = updateProjectMonthResult.value;

  await db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).findOneAndDelete({_id: projectMonthId});

  return {updatedInvoice, updatedProjectMonth};
};


export const getInvoicesController = async (req: Request<void, void, void, {months: number}>, res: Response) => {
  const getFrom = moment()
    .subtract(req.query.months, 'months')
    .startOf('month')
    .format('YYYY-MM-DD');
  const invoices = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
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

  const pdfBuffer = await createPdf(req.logger, invoice);

  if (!Buffer.isBuffer(pdfBuffer) && pdfBuffer.error) {
    return res.status(500).send(pdfBuffer.error);
  }

  let createdInvoice = await createInvoice(invoice, req.db, pdfBuffer as Buffer, req.user);

  if (invoice.projectMonth && !invoice.creditNotas?.length) {
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
      {$push: {creditNotas: createdInvoice._id.toString()}},
    );

    linkedInvoices.forEach(linkedInvoice => {
      linkedInvoice.creditNotas = [...(linkedInvoice.creditNotas || []), createdInvoice._id]; // eslint-disable-line no-param-reassign
      emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, linkedInvoice._id, linkedInvoice, 'everyone');
    });
  }

  return res.send(createdInvoice);
};



/** Update an existing invoice */
export const updateInvoiceController = async (req: ConfacRequest, res: Response) => {
  const {_id, ...invoice}: IInvoice = req.body;

  invoice.audit = updateAudit(invoice.audit, req.user);
  const updatedPdfBuffer = await createPdf(req.logger, {_id, ...invoice});

  if (!Buffer.isBuffer(updatedPdfBuffer) && updatedPdfBuffer.error) {
    return res.status(500).send(updatedPdfBuffer.error);
  }

  if (Buffer.isBuffer(updatedPdfBuffer)) {
    await req.db.collection<IAttachment>(CollectionNames.ATTACHMENTS)
      .findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {pdf: updatedPdfBuffer}});
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
  const {id, status}: {id: string; status: 'ToPay' | 'Paid'} = req.body;

  const saveResult = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(id)}, {$set: {status}}, {returnOriginal: true});

  if (!saveResult?.value) {
    return res.status(404).send('Invoice not found');
  }

  if (saveResult.value.status === status) {
    return res.status(200).send();
  }

  const originalInvoice = saveResult.value;
  const invoice = {...originalInvoice, status};
  await saveAudit(req, 'invoice', originalInvoice, invoice);

  const result: Array<any> = [{
    type: 'invoice',
    model: invoice,
  }];

  emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, invoice._id, invoice);

  // Update projectMonth.verified based on invoice status (Paid = verified)
  const verified = status === 'Paid';
  if (invoice?.projectMonth?.projectMonthId) {
    let shouldUpdateProjectMonth = true;
    if (verified && invoice.creditNotas?.length) {
      const creditNotes = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
        .find({_id: {$in: invoice.creditNotas.map(creditNotaId => new ObjectID(creditNotaId))}})
        .toArray();

      shouldUpdateProjectMonth = creditNotes.every(creditNote => creditNote.status === 'Paid');
    }

    if (shouldUpdateProjectMonth) {
      const projectMonth = await req.db.collection(CollectionNames.PROJECTS_MONTH)
        .findOneAndUpdate({_id: new ObjectID(invoice.projectMonth.projectMonthId)}, {$set: {verified}}, {returnOriginal: false});

      // TODO: projectMonth.value can be null here
      //       When deleting a projectMonth, the invoice is not unlinked
      emitEntityEvent(
        req,
        SocketEventTypes.EntityUpdated,
        CollectionNames.PROJECTS_MONTH,
        invoice.projectMonth.projectMonthId,
        projectMonth.value,
      );

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
  const {id: invoiceId}: {id: string} = req.body;

  const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOne({_id: new ObjectID(invoiceId)});

  if (invoice?.projectMonth && !invoice?.creditNotas?.length) {
    // ATTN: This is not completely correct for CreditNotas:
    //       If the original invoice is deleted before the credit notas, this will not work
    //       (but that doesn't really happen)
    const invoiceAttachments: IAttachmentCollection | null = await req.db.collection(CollectionNames.ATTACHMENTS)
      .findOne({_id: new ObjectID(invoiceId)}, {
        projection: {
          _id: false,
          pdf: false,
        },
      });

    if (invoiceAttachments !== null && Object.keys(invoiceAttachments).length > 0) {
      await req.db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).updateOne(
        {_id: new ObjectID(invoice.projectMonth.projectMonthId)},
        {$set: {...invoiceAttachments}},
        {upsert: true},
      );
    }

    const projectMonthCollection = req.db.collection(CollectionNames.PROJECTS_MONTH);
    const attachments = invoice.attachments.filter(a => a.type !== 'pdf');

    const projectMonthId = new ObjectID(invoice.projectMonth.projectMonthId);
    const updateProjectMonthResult = await projectMonthCollection.findOneAndUpdate({_id: projectMonthId}, {$set: {attachments}});
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
      {$pull: {creditNotas: invoice._id.toString()}},
    );

    linkedInvoices.forEach(toUpdate => {
      toUpdate.creditNotas = toUpdate.creditNotas.filter(x => x !== invoice._id.toString()); // eslint-disable-line no-param-reassign
      emitEntityEvent(req, SocketEventTypes.EntityUpdated, CollectionNames.INVOICES, toUpdate._id, toUpdate, 'everyone');
    });
  }

  await req.db.collection(CollectionNames.INVOICES).findOneAndDelete({_id: new ObjectID(invoiceId)});
  await req.db.collection(CollectionNames.ATTACHMENTS).findOneAndDelete({_id: new ObjectID(invoiceId)});
  emitEntityEvent(req, SocketEventTypes.EntityDeleted, CollectionNames.INVOICES, new ObjectID(invoiceId), null);

  return res.send(invoiceId);
};



/** Open the invoice pdf in the browser in a new tab */
export const previewPdfInvoiceController = async (req: Request, res: Response) => {
  const invoice: IInvoice = req.body;

  const pdfBuffer = await createPdf(req.logger, invoice);

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
    invoice.status,
    invoice.money.discount!.toString().replace('.', ','),
    `"${invoice.lines[0].desc}"`,
    invoice._id,
  ].join(separator))).join('\r\n')}`;

  const excel = `${excelHeader}${excelBody}`;

  return res.send(excel);
};


export const sendInvoiceToPeppolController = async (req: ConfacRequest, res: Response) => {
  const {id} = req.params;
  const {pdfFileName} = req.body;

  // Fetch the invoice
  const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOne({_id: new ObjectID(id)});

  if (!invoice) {
    return res.status(400).send({message: 'Invoice not found'});
  }
  // if (invoice.lastEmail) {
  //   return res.status(400).send({message: 'Invoice was already sent to Peppol'});
  // }

  // Fetch the client
  const client = await req.db.collection<IClient>(CollectionNames.CLIENTS)
    .findOne({_id: new ObjectID(invoice.client._id)});

  if (!client) {
    return res.status(400).send({message: 'Client not found'});
  }

  logger.info(`SEND INVOICE TO PEPPOL - Invoice Nr=${invoice.number} ID: ${id}`);

  try {
    const apiClient: ApiClient = ApiClientFactory.fromConfig(config);

    let project: IProject | undefined;
    if (invoice.projectMonth?.projectMonthId) {
      const projectMonth = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH)
        .findOne({_id: new ObjectID(invoice.projectMonth.projectMonthId)});
      if (projectMonth) {
        project = await req.db.collection(CollectionNames.PROJECTS)
          .findOne({_id: new ObjectID(projectMonth.projectId)});
      }
    }

    // Step 1: Create invoice at Billit
    const createOrderRequest: CreateOrderRequest = CreateOrderRequestFactory.fromInvoice(invoice, client, project);

    // Fetch attachments from DB
    const attachmentDoc = await req.db
      .collection(CollectionNames.ATTACHMENTS)
      .findOne({_id: new ObjectID(invoice._id)});

    // Add PDF to CreateOrderRequest
    if (attachmentDoc?.pdf) {
      const pdfBuffer: Buffer = attachmentDoc.pdf.buffer;
      const orderPdf: Attachment = {
        FileName: pdfFileName || `invoice-${invoice.number}.pdf`,
        MimeType: 'application/pdf',
        FileContent: pdfBuffer.toString('base64'),
      };
      createOrderRequest.OrderPDF = orderPdf;
    }

    // Add other attachments to CreateOrderRequest
    const getBillitAttachments = async (): Promise<Attachment[]> => {
      const attachmentPromises: Promise<Attachment>[] = invoice.attachments
        .filter(attachment => attachment.type === 'Getekende timesheet')
        .map(invoiceAttachment => toBillitAttachment(invoiceAttachment));
      return Promise.all(attachmentPromises);
    };

    const toBillitAttachment = async (invoiceAttachment: IAttachment): Promise<Attachment> => {
      const buffer: Buffer = attachmentDoc[invoiceAttachment.type].buffer;
      return {
        FileName: invoiceAttachment.fileName,
        MimeType: invoiceAttachment.fileType,
        FileContent: buffer.toString('base64'),
      };
    };
    createOrderRequest.Attachments = await getBillitAttachments();

    if (!invoice.billit?.orderId) {
      try {
        const orderId: number = await apiClient.createOrder(createOrderRequest, `create-order-${invoice.number.toString()}`);

        const updatedAudit = updateAudit(invoice.audit, req.user);
        await req.db.collection<IInvoice>(CollectionNames.INVOICES).updateOne(
          {_id: new ObjectID(invoice._id)},
          {$set: {billit: {orderId}, status: 'ToSend', audit: updatedAudit}},
        );
        invoice.billit = {orderId};
        invoice.status = 'ToSend';
        invoice.audit = updatedAudit;
      } catch (error: any) {
        if (error instanceof BillitError && error.isIdempotentTokenAlreadyExistsError()) {
          logger.info(`IdempotencyKey already exists for InvoiceNr=${invoice.number}, billitId=${invoice.billit?.orderId}`);
        } else {
          logger.error(`sendInvoice error "${error?.message}": ${JSON.stringify(error)} for #${invoice.number}`);
          throw error;
        }
      }
    }

    // Step 2: Determine peppolEnabled status
    if (!client.peppolEnabled) {
      const vatNumber: string = VatNumberFactory.fromClient(client);
      const peppolResponse: GetParticipantInformationResponse = await apiClient.getParticipantInformation(vatNumber);
      client.peppolEnabled = peppolResponse.Registered;

      if (client.peppolEnabled) {
        await req.db.collection<IClient>(CollectionNames.CLIENTS).updateOne(
          {_id: new ObjectID(client._id)},
          {$set: {peppolEnabled: true}},
        );
        emitEntityEvent(
          req,
          SocketEventTypes.EntityUpdated,
          CollectionNames.CLIENTS,
          client._id,
          {...client, peppolEnabled: true},
        );
      }
    }

    // Step 3: Send the sales invoice with appropriate transport type
    const sendInvoiceRequest: SendInvoiceRequest = SendInvoiceRequestFactory.fromInvoice(invoice);
    const idempotencyKey = `send-invoice-${invoice.number.toString()}`;

    try {
      const sentToPeppol = new Date().toISOString();
      await apiClient.sendInvoice(sendInvoiceRequest, idempotencyKey);

      const sentAudit = updateAudit(invoice.audit, req.user);
      const updatedInvoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOneAndUpdate(
        {_id: new ObjectID(invoice._id)},
        {$set: {lastEmail: sentToPeppol, status: 'ToPay', audit: sentAudit}},
      );
      if (updatedInvoice.ok && updatedInvoice.value) {
        emitEntityEvent(
          req,
          SocketEventTypes.EntityUpdated,
          CollectionNames.INVOICES,
          updatedInvoice.value._id,
          {...updatedInvoice.value, lastEmail: sentToPeppol, status: 'ToPay', audit: sentAudit},
        );
      }

    } catch (error: any) {
      if (error instanceof BillitError && error.isIdempotentTokenAlreadyExistsError()) {
        logger.info(`Idempotent '${idempotencyKey}' already exists, invoiceNr=${invoice.number}, billitId=${invoice.billit?.orderId}`);
      } else {
        logger.error(`sendInvoice error "${error?.message}": ${JSON.stringify(error)} for #${invoice.number}`);
        throw error;
      }
    }

    return res.status(200).send({message: 'Invoice sent to Peppol'});

  } catch (error: any) {
    logger.error('Error processing Peppol request:', error);
    const errorResponse: any = {
      message: 'Error processing Peppol request',
      error: error.message,
    };

    // Include Billit API errors if present
    if (error instanceof BillitError) {
      errorResponse.errors = error.billitErrors;
    }

    return res.status(500).send(errorResponse);
  }
};


export const refreshPeppolStatusController = async (req: ConfacRequest, res: Response) => {
  const {id} = req.params;

  const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
    .findOne({_id: new ObjectID(id)});

  if (!invoice) {
    return res.status(400).send({message: 'Invoice not found'});
  }

  if (!invoice.billit?.orderId) {
    return res.status(400).send({message: 'Invoice has no Billit order'});
  }

  try {
    const updatedInvoice = await syncBillitOrder(req, invoice.billit.orderId);
    if (updatedInvoice) {
      return res.status(200).send({message: 'Peppol status refreshed'});
    }
    return res.status(200).send({message: 'No changes'});
  } catch (error: any) {
    logger.error('Error refreshing Peppol status:', error);
    return res.status(500).send({message: 'Error refreshing Peppol status', error: error.message});
  }
};
