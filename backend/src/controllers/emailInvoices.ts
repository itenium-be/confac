import {Request, Response} from 'express';
import PDFMerge from 'pdf-merge';
import sgMail from '@sendgrid/mail';
import {MailData} from '@sendgrid/helpers/classes/mail';
import fs from 'fs';
import tmp from 'tmp';
import {ObjectID} from 'mongodb';
import {IAttachmentCollection, IAttachments, ISendGridAttachment} from '../models/attachments';
import {IEmail} from '../models/clients';
import {CollectionNames, IAttachment} from '../models/common';


type EmailAttachmentRequest = {
  type: 'pdf' | string;
  fileName: string;
  fileType: string;
}
type EmailRequest = Omit<IEmail, 'attachments'> & {attachments: EmailAttachmentRequest[]};


export const emailInvoiceController = async (req: Request, res: Response) => {
  const invoiceId = req.params.id;
  const email: EmailRequest = req.body;

  const attachmentTypes = email.attachments.map(a => a.type).reduce((acc: { [key: string]: number; }, cur) => {
    acc[cur] = 1;
    return acc;
  }, {});
  const attachmentBuffers: IAttachmentCollection | null = await req.db
    .collection(CollectionNames.ATTACHMENTS)
    .findOne({_id: new ObjectID(invoiceId)}, attachmentTypes);

  if (!attachmentBuffers)
    return res.status(500).send({message: "Couldn't find attachments!?"});

  if (email.combineAttachments && email.attachments.some(attachment => attachment.fileType !== 'application/pdf'))
    return res.status(400).send({message: 'Emailing with combineAttachments=true: Can only merge pdfs'});


  const data = await req.db.collection('attachments_config').findOne({});
  const termsAndConditions: Buffer = data?.TermsAndConditions?.buffer;

  const mailData = await buildInvoiceEmailData(email, attachmentBuffers, termsAndConditions);
  const emailRes = await sendEmail(res, mailData);
  if (emailRes)
    return emailRes;

  if (req.query.emailInvoiceOnly) {
    await sendInvoiceOnlyEmail(email, attachmentBuffers, req.query.emailInvoiceOnly);
  }

  const lastEmailSent = new Date().toISOString();
  await req.db
    .collection(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(invoiceId)}, {$set: {lastEmail: lastEmailSent}});

  return res.status(200).send(lastEmailSent);
};



async function buildInvoiceEmailData(
  email: EmailRequest,
  attachmentBuffers: IAttachmentCollection,
  termsAndConditions: Buffer
): Promise<MailData> {

  // Make sure the invoice is the first document in the array
  // eslint-disable-next-line no-nested-ternary
  const attachments = email.attachments.sort((a, b) => (a.type === 'pdf' ? -1 : b.type === 'pdf' ? 1 : 0));

  // Combine Invoice PDF & Timesheet?
  let sendGridAttachments: (Omit<ISendGridAttachment, 'content'> & {content: Buffer})[] = [];
  if (email.combineAttachments) {
    const files: tmp.FileResult[] = [];
    attachments.forEach(attachment => {
      const tmpFile = tmp.fileSync();
      fs.writeSync(tmpFile.fd, attachmentBuffers[attachment.type as keyof IAttachment].buffer);
      files.push(tmpFile);
    });

    const mergedPdfs: Buffer = await PDFMerge(files.map(f => f.name));

    const invoiceAttachment = attachments.find(attachment => attachment.type === 'pdf');
    if (invoiceAttachment) {
      sendGridAttachments = [{
        content: mergedPdfs,
        filename: invoiceAttachment.fileName,
        type: invoiceAttachment.fileType,
        disposition: 'attachment',
      }];
    }
    files.forEach(file => file.removeCallback());

  } else {
    sendGridAttachments = attachments.map(attachment => ({
      content: attachmentBuffers[attachment.type],
      filename: attachment.fileName,
      type: attachment.fileType,
      disposition: 'attachment',
    }));
  }


  // Merge Terms & Conditions with the invoice pdf
  if (termsAndConditions) {
    const invoiceBuffer = sendGridAttachments[0].content.buffer;

    const invoiceFile = tmp.fileSync();
    fs.writeSync(invoiceFile.fd, invoiceBuffer);

    const termsCondFile = tmp.fileSync();
    fs.writeSync(termsCondFile.fd, termsAndConditions);

    const mergedInvoicePdf: Buffer = await PDFMerge([invoiceFile, termsCondFile].map(f => f.name));
    sendGridAttachments = sendGridAttachments.map((att, idx) => idx === 0 ? {...att, content: mergedInvoicePdf} : att);

    invoiceFile.removeCallback();
    termsCondFile.removeCallback();
  }

  return {
    to: email.to.split(';'),
    cc: email.cc?.split(';'),
    bcc: email.bcc?.split(';'),
    from: email.from as string,
    subject: email.subject,
    // text: '',
    html: email.body,
    attachments: sendGridAttachments.map(att => ({...att, content: att.content.toString('base64')})),
  };
}






async function sendEmail(res: Response, mailData: MailData): Promise<Response | null> {
  try {
    await sgMail.send(mailData, false).then(() => {
      const tos = [mailData.to, mailData.cc, mailData.bcc].filter(x => !!x).join(', ');
      const atts = mailData.attachments?.map(x => x.filename);
      // eslint-disable-next-line
      console.log(`Mail sent successfully to ${tos}. Subject=${mailData.subject}. Attachments=${atts}`);
    });

  } catch (error) {
    if (error.code === 401) {
      // eslint-disable-next-line
      console.log('SendGrid returned 401. API key not set?');
      return res.status(400).send({message: 'Has the SendGrid API Key been set?'});
    }

    // eslint-disable-next-line
    console.log('SendGrid returned an error', error.response?.body);
    return res.status(400).send(error.response?.body?.errors[0]);
  }

  return null;
}



/**
 * Send email with only the invoice, not the timesheet etc
 * This email is sent only once
 **/
async function sendInvoiceOnlyEmail(email: EmailRequest, attachmentBuffers: IAttachmentCollection, emailInvoiceOnly: string): Promise<void> {
  const attachment = email.attachments.find(x => x.type === 'pdf')!;
  const invoiceOnlyAttachments = [{
    content: attachmentBuffers[attachment.type].toString('base64'),
    filename: attachment.fileName,
    type: attachment.fileType,
    disposition: 'attachment',
  }];

  const invoiceOnlyData = {
    to: emailInvoiceOnly,
    from: email.from as string,
    subject: email.subject,
    html: email.body,
    attachments: invoiceOnlyAttachments,
  };

  await sgMail.send(invoiceOnlyData, false).then(() => {
    console.log(`emailInvoiceOnly sent to ${emailInvoiceOnly}`);
  });
}
