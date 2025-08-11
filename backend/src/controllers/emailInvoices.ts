import {Request, Response} from 'express';
import PDFMerge from 'pdf-merge';
import nodemailer from 'nodemailer';
import fs from 'fs';
import tmp from 'tmp';
import {ObjectID} from 'mongodb';
import {IAttachmentCollection, IEmailAttachment} from '../models/attachments';
import {IEmail} from '../models/clients';
import {CollectionNames, IAttachment, SocketEventTypes} from '../models/common';
import {emitEntityEvent} from './utils/entity-events';
import {ConfacRequest} from '../models/technical';
import config from '../config';


type EmailAttachmentRequest = {
  type: 'pdf' | string;
  fileName: string;
  fileType: string;
}
type EmailRequest = Omit<IEmail, 'attachments'> & {attachments: EmailAttachmentRequest[]};


export const emailInvoiceController = async (req: Request<{id: number}, any, EmailRequest, {emailInvoiceOnly: string}>, res: Response) => {
  const invoiceId = req.params.id;
  const email = req.body;

  const attachmentTypes = email.attachments.map(a => a.type).reduce((acc: {[key: string]: number}, cur) => {
    acc[cur] = 1;
    return acc;
  }, {});
  const attachmentBuffers: IAttachmentCollection | null = await req.db
    .collection(CollectionNames.ATTACHMENTS)
    .findOne({_id: new ObjectID(invoiceId)}, attachmentTypes);

  if (!attachmentBuffers) {
    return res.status(500).send({message: 'Couldn\'t find attachments!?'});
  }

  if (email.combineAttachments && email.attachments.some(attachment => attachment.fileType !== 'application/pdf')) {
    return res.status(400).send({message: 'Emailing with combineAttachments=true: Can only merge pdfs'});
  }


  const data = await req.db.collection('attachments_config').findOne({});
  const termsAndConditions: Buffer = data?.TermsAndConditions?.buffer;

  const mailData = await buildInvoiceEmailData(email, attachmentBuffers, termsAndConditions);
  const emailRes = await sendEmail(res, mailData);
  if (emailRes) {
    return emailRes;
  }

  if (req.query.emailInvoiceOnly) {
    await sendInvoiceOnlyEmail(email, attachmentBuffers, req.query.emailInvoiceOnly);
  }

  const lastEmailSent = new Date().toISOString();
  const updatedInvoice = await req.db
    .collection(CollectionNames.INVOICES)
    .findOneAndUpdate({_id: new ObjectID(invoiceId)}, {$set: {lastEmail: lastEmailSent}});

  if (updatedInvoice.ok && updatedInvoice.value) {
    emitEntityEvent(
      req as unknown as ConfacRequest,
      SocketEventTypes.EntityUpdated,
      CollectionNames.INVOICES,
      updatedInvoice.value._id,
      {...updatedInvoice.value, lastEmail: lastEmailSent},
    );
  }

  return res.status(200).send(lastEmailSent);
};



async function buildInvoiceEmailData(
  email: EmailRequest,
  attachmentBuffers: IAttachmentCollection,
  termsAndConditions: Buffer,
): Promise<IEmailData> {

  // Make sure the invoice is the first document in the array
  // eslint-disable-next-line no-nested-ternary
  const attachments = email.attachments.sort((a, b) => (a.type === 'pdf' ? -1 : b.type === 'pdf' ? 1 : 0));

  // Combine Invoice PDF & Timesheet?
  let emailAttachments: (Omit<IEmailAttachment, 'content'> & {content: Buffer})[] = [];
  if (email.combineAttachments) {
    const files: tmp.FileResult[] = [];
    attachments.forEach(attachment => {
      const tmpFile = tmp.fileSync();
      fs.writeSync(tmpFile.fd, attachmentBuffers[attachment.type as keyof IAttachment].buffer as Buffer);
      files.push(tmpFile);
    });

    const mergedPdfs: Buffer = await PDFMerge(files.map(f => f.name));

    const invoiceAttachment = attachments.find(attachment => attachment.type === 'pdf');
    if (invoiceAttachment) {
      emailAttachments = [{
        content: mergedPdfs,
        filename: invoiceAttachment.fileName,
        type: invoiceAttachment.fileType,
      }];
    }
    files.forEach(file => file.removeCallback());

  } else {
    emailAttachments = attachments.map(attachment => ({
      content: attachmentBuffers[attachment.type],
      filename: attachment.fileName,
      type: attachment.fileType,
    }));
  }


  // Merge Terms & Conditions with the invoice pdf
  if (termsAndConditions) {
    const invoiceBuffer = emailAttachments[0].content.buffer;

    const invoiceFile = tmp.fileSync();
    fs.writeSync(invoiceFile.fd, invoiceBuffer as Buffer);

    const termsCondFile = tmp.fileSync();
    fs.writeSync(termsCondFile.fd, termsAndConditions);

    const mergedInvoicePdf: Buffer = await PDFMerge([invoiceFile, termsCondFile].map(f => f.name));
    // eslint-disable-next-line no-confusing-arrow
    emailAttachments = emailAttachments.map((att, idx) => idx === 0 ? {...att, content: mergedInvoicePdf} : att);

    invoiceFile.removeCallback();
    termsCondFile.removeCallback();
  }

  const emailData: IEmailData = {
    to: email.to.split(';'),
    cc: email.cc?.split(';').filter(x => !!x),
    bcc: email.bcc?.split(';').filter(x => !!x),
    from: email.from as string,
    subject: email.subject,
    // text: '',
    html: email.body,
    attachments: emailAttachments.map(att => ({...att, content: att.content.toString('base64')})),
  };
  return emailData;
}


interface IEmailData {
  to: string[] | string;
  cc?: string[];
  bcc?: string[];
  from: string;
  subject: string;
  html: string;
  attachments: IEmailAttachment[];
}


async function sendEmailCore(mailData: IEmailData) {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  // transporter.verify((error, success) => {
  //   if (error) {
  //     console.log('Connection error:', error);
  //   } else {
  //     console.log('Server is ready to take our messages', success);
  //   }
  // });

  const info = await transporter.sendMail({
    // from: mailData.from,
    from: '"Itenium Finance" <wouter.van.schandevijl@itenium.be>',
    // to: 'woutervs@hotmail.com',
    replyTo: 'finance@itenium.be',
    to: mailData.to,
    cc: mailData.cc,
    bcc: mailData.bcc,
    subject: mailData.subject,
    // text: mailData.html,
    html: mailData.html,
    attachments: mailData.attachments.map(att => ({
      filename: att.filename,
      encoding: 'base64',
      // contentType: att.type,
      contentDisposition: 'attachment',
      content: att.content,
    })),
  });

  return info;
}


async function sendEmail(res: Response, mailData: IEmailData): Promise<Response | null> {
  try {
    const info = await sendEmailCore(mailData);

    const tos = [mailData.to, mailData.cc, mailData.bcc].filter(x => !!x).join(', ');
    const atts = mailData.attachments?.map((x: any) => x.filename);
    // eslint-disable-next-line
    console.log(`Mail sent with status: ${JSON.stringify(info)} to ${tos}. Subject=${mailData.subject}. Attachments=${atts}`);

    if (info.rejected?.length) {
      return res.status(400).send(info.response);
    }

  } catch (err) {
    // eslint-disable-next-line
    console.log('Email error', err);
    return res.status(400).send(err);
  }

  return null;
}



/**
 * Send email with only the invoice, not the timesheet etc
 * This email is sent only once
 * */
async function sendInvoiceOnlyEmail(
  email: EmailRequest,
  attachmentBuffers: IAttachmentCollection,
  emailInvoiceOnly: string,
): Promise<void> {

  const attachment = email.attachments.find(x => x.type === 'pdf')!;
  const invoiceOnlyAttachments: IEmailAttachment[] = [{
    content: attachmentBuffers[attachment.type].toString('base64'),
    filename: attachment.fileName,
    type: attachment.fileType,
  }];

  const invoiceOnlyData = {
    to: emailInvoiceOnly,
    from: email.from as string,
    subject: email.subject,
    html: email.body,
    attachments: invoiceOnlyAttachments,
  };

  const info = await sendEmailCore(invoiceOnlyData);
  if (info.rejected?.length) {
    console.error(`FAILED to send PDF email only for: ${email.subject}`, info); // eslint-disable-line
  }
}
