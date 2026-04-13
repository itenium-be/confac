import {ObjectID} from 'mongodb';
import {ConfacRequest} from '../../models/technical';
import {CollectionNames, IAttachment, SocketEventTypes} from '../../models/common';
import {IInvoice, InvoiceStatus} from '../../models/invoices';
import {IProject} from '../../models/projects';
import {IProjectMonth} from '../../models/projectsMonth';
import {IClient} from '../../models/clients';
import {ICompanyConfig} from '../../models/config';
import {IAttachmentCollection} from '../../models/attachments';
import {
  buildInvoiceEmailData,
  sendEmailCore,
  EmailRequest,
  EmailAttachmentRequest,
} from '../../controllers/emailInvoices';
import {invoiceReplacements} from '../../controllers/utils/invoice-replacements';
import {emitEntityEvent} from '../../controllers/utils/entity-events';
import {logger} from '../../logger';


/**
 * Sends a duplicate invoice email (invoice PDF + timesheet) to the client when
 * the invoice transitions to 'ToPay' (i.e. Peppol has accepted it), provided
 * the project has the `emailInvoiceDuplicate` flag enabled.
 * No-op if the transition or flag conditions aren't met.
 */
export async function maybeSendPeppolDuplicate(
  req: ConfacRequest,
  invoice: IInvoice,
  previousStatus: InvoiceStatus | undefined,
): Promise<void> {
  if (previousStatus === 'ToPay' || invoice.status !== 'ToPay') {
    return;
  }

  const projectMonthId = invoice.projectMonth?.projectMonthId;
  if (!projectMonthId) return;

  const projectMonth = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH)
    .findOne({_id: new ObjectID(projectMonthId)});
  if (!projectMonth) return;

  const project = await req.db.collection<IProject>(CollectionNames.PROJECTS)
    .findOne({_id: new ObjectID(projectMonth.projectId)});
  if (!project?.projectMonthConfig?.emailInvoiceDuplicate) return;

  const client = await req.db.collection<IClient>(CollectionNames.CLIENTS)
    .findOne({_id: new ObjectID(invoice.client._id)});
  if (!client?.email?.to) {
    logger.warn(`maybeSendPeppolDuplicate: invoice #${invoice.number} has no client email, skipping`);
    return;
  }

  const companyConfig = await req.db.collection<ICompanyConfig>(CollectionNames.CONFIG).findOne({key: 'conf'});
  if (!companyConfig) {
    logger.warn(`maybeSendPeppolDuplicate: no company config, skipping invoice #${invoice.number}`);
    return;
  }

  const creditNotes = invoice.creditNotas?.length
    ? await req.db.collection<IInvoice>(CollectionNames.INVOICES)
      .find({_id: {$in: invoice.creditNotas.map(id => new ObjectID(id))}})
      .toArray()
    : [];

  const defaultEmail = companyConfig.email;
  const clientEmail = client.email;
  const baseSubject = clientEmail.subject || defaultEmail.subject;
  const baseBody = clientEmail.body || defaultEmail.body;

  let subject = invoiceReplacements(baseSubject, invoice, creditNotes);
  if (companyConfig.emailPeppolDuplicateSubject) {
    subject = invoiceReplacements(companyConfig.emailPeppolDuplicateSubject, invoice, creditNotes);
  }

  let body = baseBody;
  if (companyConfig.emailPeppolDuplicateBody) {
    body = companyConfig.emailPeppolDuplicateBody;
  }
  body = invoiceReplacements(body, invoice, creditNotes);
  if (companyConfig.emailSignature) {
    body += companyConfig.emailSignature;
  }

  const attachmentTypes: string[] = (clientEmail.attachments?.length
    ? clientEmail.attachments
    : defaultEmail.attachments || []
  ).map((a: IAttachment | string) => (typeof a === 'string' ? a : a.type));
  if (!attachmentTypes.includes('pdf')) {
    attachmentTypes.unshift('pdf');
  }

  const fileNameTemplate = client.invoiceFileName || companyConfig.company.template || 'invoice';
  const pdfFileName = `${invoiceReplacements(fileNameTemplate, invoice, creditNotes)}.pdf`;
  const resolvedAttachments: EmailAttachmentRequest[] = attachmentTypes
    .map((type): EmailAttachmentRequest | null => {
      if (type === 'pdf') {
        return {type: 'pdf', fileName: pdfFileName, fileType: 'application/pdf'};
      }
      const details = invoice.attachments.find(a => a.type === type);
      if (!details) return null;
      return {type, fileName: details.fileName, fileType: details.fileType};
    })
    .filter((a): a is EmailAttachmentRequest => a !== null);

  if (resolvedAttachments.length === 0) {
    logger.warn(`maybeSendPeppolDuplicate: no attachments resolved for invoice #${invoice.number}, skipping`);
    return;
  }

  const emailRequest: EmailRequest = {
    from: defaultEmail.from,
    to: client.email.to,
    cc: clientEmail.cc || defaultEmail.cc,
    bcc: clientEmail.bcc || defaultEmail.bcc,
    subject,
    body,
    combineAttachments: clientEmail.combineAttachments || defaultEmail.combineAttachments,
    attachments: resolvedAttachments,
  };

  const attachmentTypesMap = resolvedAttachments.map(a => a.type).reduce((acc: Record<string, number>, cur) => {
    acc[cur] = 1;
    return acc;
  }, {});
  const attachmentBuffers = await req.db
    .collection<IAttachmentCollection>(CollectionNames.ATTACHMENTS)
    .findOne({_id: new ObjectID(invoice._id)}, attachmentTypesMap);
  if (!attachmentBuffers) {
    logger.warn(`maybeSendPeppolDuplicate: attachments doc missing for invoice #${invoice.number}, skipping`);
    return;
  }

  const attachmentsConfigDoc = await req.db.collection('attachments_config').findOne({});
  const termsAndConditions: Buffer = attachmentsConfigDoc?.TermsAndConditions?.buffer;

  try {
    const mailData = await buildInvoiceEmailData(emailRequest, attachmentBuffers, termsAndConditions);
    const info = await sendEmailCore(mailData);
    if (info.rejected?.length) {
      logger.error(`maybeSendPeppolDuplicate: email rejected for invoice #${invoice.number}: ${info.response}`);
      return;
    }

    const lastEmailSent = new Date().toISOString();
    const updated = await req.db.collection<IInvoice>(CollectionNames.INVOICES)
      .findOneAndUpdate(
        {_id: new ObjectID(invoice._id)},
        {$set: {lastEmail: lastEmailSent}},
        {returnDocument: 'after'},
      );
    if (updated.ok && updated.value) {
      emitEntityEvent(
        req,
        SocketEventTypes.EntityUpdated,
        CollectionNames.INVOICES,
        updated.value._id,
        updated.value,
      );
    }
    logger.info(`maybeSendPeppolDuplicate: duplicate email sent for invoice #${invoice.number} to ${client.email.to}`);
  } catch (err) {
    logger.error(`maybeSendPeppolDuplicate: failed to send duplicate email for invoice #${invoice.number}`, err);
  }
}
