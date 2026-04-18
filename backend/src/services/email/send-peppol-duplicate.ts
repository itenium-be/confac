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
 * Sends duplicate invoice emails when the invoice transitions to 'ToPay' (Peppol accepted):
 * 1. If config.emailInvoiceOnly is set: sends PDF-only email to that address
 * 2. If project.emailInvoiceDuplicate is set: sends full email (PDF + timesheet) to client
 */
export async function maybeSendPeppolDuplicate(
  req: ConfacRequest,
  invoice: IInvoice,
  previousStatus: InvoiceStatus | undefined,
): Promise<void> {
  if (previousStatus === 'ToPay' || invoice.status !== 'ToPay') {
    return;
  }

  const companyConfig = await req.db.collection<ICompanyConfig>(CollectionNames.CONFIG).findOne({key: 'conf'});
  if (!companyConfig) {
    logger.warn(`maybeSendPeppolDuplicate: no company config, skipping invoice #${invoice.number}`);
    return;
  }

  const client = await req.db.collection<IClient>(CollectionNames.CLIENTS)
    .findOne({_id: new ObjectID(invoice.client._id)});

  // Check if we should send PDF-only to config.emailInvoiceOnly
  const shouldSendInvoiceOnly = !!companyConfig.emailInvoiceOnly;

  // Check if we should send full email to client (project-level setting)
  let shouldSendToClient = false;
  const projectMonthId = invoice.projectMonth?.projectMonthId;
  if (projectMonthId) {
    const projectMonth = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH)
      .findOne({_id: new ObjectID(projectMonthId)});
    if (projectMonth) {
      const project = await req.db.collection<IProject>(CollectionNames.PROJECTS)
        .findOne({_id: new ObjectID(projectMonth.projectId)});
      shouldSendToClient = !!project?.projectMonthConfig?.emailInvoiceDuplicate;
    }
  }

  if (!shouldSendInvoiceOnly && !shouldSendToClient) {
    return;
  }

  if (shouldSendToClient && !client?.email?.to) {
    logger.warn(`maybeSendPeppolDuplicate: invoice #${invoice.number} has no client email, skipping client email`);
    shouldSendToClient = false;
  }

  if (!shouldSendInvoiceOnly && !shouldSendToClient) {
    return;
  }

  const creditNotes = invoice.creditNotas?.length
    ? await req.db.collection<IInvoice>(CollectionNames.INVOICES)
      .find({_id: {$in: invoice.creditNotas.map(id => new ObjectID(id))}})
      .toArray()
    : [];

  const defaultEmail = companyConfig.email;
  const clientEmail = client?.email;
  const fileNameTemplate = client?.invoiceFileName || companyConfig.company.template || 'invoice';
  const pdfFileName = `${invoiceReplacements(fileNameTemplate, invoice, creditNotes)}.pdf`;

  // Fetch attachment buffers
  const attachmentBuffers = await req.db
    .collection<IAttachmentCollection>(CollectionNames.ATTACHMENTS)
    .findOne({_id: new ObjectID(invoice._id)});
  if (!attachmentBuffers?.pdf) {
    logger.warn(`maybeSendPeppolDuplicate: PDF attachment missing for invoice #${invoice.number}, skipping`);
    return;
  }

  let lastEmailSent: string | null = null;

  // 1. Send PDF-only email to config.emailInvoiceOnly
  if (shouldSendInvoiceOnly) {
    const subject = invoiceReplacements(
      companyConfig.emailPeppolDuplicateSubject || defaultEmail.subject,
      invoice,
      creditNotes,
    );
    let body = companyConfig.emailPeppolDuplicateBody || defaultEmail.body;
    body = invoiceReplacements(body, invoice, creditNotes);
    if (companyConfig.emailSignature) {
      body += companyConfig.emailSignature;
    }

    const pdfRaw = attachmentBuffers.pdf as {buffer?: Buffer} | Buffer;
    const pdfBuffer = (pdfRaw as {buffer?: Buffer}).buffer ?? (pdfRaw as Buffer);

    try {
      const info = await sendEmailCore({
        from: defaultEmail.from || '',
        to: companyConfig.emailInvoiceOnly!,
        subject,
        html: body,
        attachments: [{
          content: pdfBuffer.toString('base64'),
          filename: pdfFileName,
          type: 'application/pdf',
        }],
      });
      if (info.rejected?.length) {
        logger.error(`maybeSendPeppolDuplicate: PDF-only email rejected for invoice #${invoice.number}: ${info.response}`);
      } else {
        logger.info(`maybeSendPeppolDuplicate: PDF-only email sent for invoice #${invoice.number} to ${companyConfig.emailInvoiceOnly}`);
        lastEmailSent = new Date().toISOString();
      }
    } catch (err) {
      logger.error(`maybeSendPeppolDuplicate: failed to send PDF-only email for invoice #${invoice.number}`, err);
    }
  }

  // 2. Send full email (with all attachments) to client
  if (shouldSendToClient && client?.email?.to) {
    const baseSubject = clientEmail?.subject || defaultEmail.subject;
    const baseBody = clientEmail?.body || defaultEmail.body;

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

    const attachmentTypes: string[] = (clientEmail?.attachments?.length
      ? clientEmail.attachments
      : defaultEmail.attachments || []
    ).map((a: IAttachment | string) => (typeof a === 'string' ? a : a.type));
    if (!attachmentTypes.includes('pdf')) {
      attachmentTypes.unshift('pdf');
    }

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
      logger.warn(`maybeSendPeppolDuplicate: no attachments resolved for invoice #${invoice.number}, skipping client email`);
    } else {
      // Fetch all needed attachment buffers
      const attachmentTypesMap = resolvedAttachments.map(a => a.type).reduce((acc: Record<string, number>, cur) => {
        acc[cur] = 1;
        return acc;
      }, {});
      const allAttachmentBuffers = await req.db
        .collection<IAttachmentCollection>(CollectionNames.ATTACHMENTS)
        .findOne({_id: new ObjectID(invoice._id)}, attachmentTypesMap);

      if (!allAttachmentBuffers) {
        logger.warn(`maybeSendPeppolDuplicate: attachments doc missing for invoice #${invoice.number}, skipping client email`);
      } else {
        const emailRequest: EmailRequest = {
          from: defaultEmail.from,
          to: client.email.to,
          cc: clientEmail?.cc || defaultEmail.cc,
          bcc: clientEmail?.bcc || defaultEmail.bcc,
          subject,
          body,
          combineAttachments: clientEmail?.combineAttachments || defaultEmail.combineAttachments,
          attachments: resolvedAttachments,
        };

        const attachmentsConfigDoc = await req.db.collection('attachments_config').findOne({});
        const termsAndConditions: Buffer = attachmentsConfigDoc?.TermsAndConditions?.buffer;

        try {
          const mailData = await buildInvoiceEmailData(logger, emailRequest, allAttachmentBuffers, termsAndConditions);
          const info = await sendEmailCore(mailData);
          if (info.rejected?.length) {
            logger.error(`maybeSendPeppolDuplicate: client email rejected for invoice #${invoice.number}: ${info.response}`);
          } else {
            logger.info(`maybeSendPeppolDuplicate: client email sent for invoice #${invoice.number} to ${client.email.to}`);
            lastEmailSent = new Date().toISOString();
          }
        } catch (err) {
          logger.error(`maybeSendPeppolDuplicate: failed to send client email for invoice #${invoice.number}`, err);
        }
      }
    }
  }

  // Update lastEmail timestamp if any email was sent
  if (lastEmailSent) {
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
  }
}
