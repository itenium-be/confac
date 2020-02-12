import {Request, Response} from 'express';
import JSZip from 'jszip';
import moment from 'moment';
import {ObjectID} from 'mongodb';

import {IAttachment} from '../models/attachments';
import {CollectionNames} from '../models/common';
import {IInvoice} from '../models/invoices';
import {IClient} from '../models/clients';

export const getAttachment = async (req: Request, res: Response) => {
  const {
    id, model, type, fileName,
  } = req.params;

  let attachment: IAttachment | null;
  if (model === 'client') {
    attachment = await req.db.collection(CollectionNames.ATTACHMENTS_CLIENT).findOne({_id: new ObjectID(id)});
  } else {
    attachment = await req.db.collection(CollectionNames.ATTACHMENTS).findOne({_id: new ObjectID(id)});
  }

  let attachmentBuffer: Buffer | null = null;
  if (attachment) {
    attachmentBuffer = attachment[type].buffer as Buffer;
  } else {
    res.status(500).send('Could not get the requested file.');
  }

  let responseType: string = '';
  if (!req.query.download) {
    const ext = fileName.substr(fileName.lastIndexOf('.') + 1);

    const determineResponseType = (): string => {
      if (type === 'pdf' || ext === 'pdf') {
        return 'application/pdf';
      } if (['png', 'bmp', 'jpg', 'gif'].includes(ext)) {
        return `image/${ext}`;
      } if (['html', 'htm'].includes(ext)) {
        return 'text/html';
      } if (['ppt'].includes(ext)) {
        return 'application/vnd.ms-powerpoint';
      } if (['pptx'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } if (['txt'].includes(ext)) {
        return 'text/plain';
      } if (['xls'].includes(ext)) {
        return 'application/vnd.ms-excel';
      } if (['xlsx', 'xlsm'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } if (['csv'].includes(ext)) {
        return 'text/csv';
      } if (['doc'].includes(ext)) {
        return 'application/msword';
      } if (['docx'].includes(ext)) {
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } if (['odp'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.presentation';
      } if (['ods'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.spreadsheet';
      } if (['odt'].includes(ext)) {
        return 'application/vnd.oasis.opendocument.text';
      }
      return '';
    };

    responseType = determineResponseType();
  }

  // Download the file
  if (!fileName) {
    // eslint-disable-next-line no-console
    console.log('Downloading a file without knowing the filename', req.params);
  }

  return res.type(responseType).set('Content-Disposition', `inline;filename=${fileName}`)
    .send(attachmentBuffer);
};

export const createZipWithInvoices = async (req: Request, res: Response) => {
  const invoiceIds: ObjectID[] = req.body.map((invoiceId: string) => new ObjectID(invoiceId));

  const attachments: IAttachment[] = await req.db.collection(CollectionNames.ATTACHMENTS).find({_id: {$in: invoiceIds}})
    .toArray();

  const invoices: IInvoice[] = await req.db.collection(CollectionNames.INVOICES).find({_id: {$in: invoiceIds}})
    .toArray();

  const zip = new JSZip();

  attachments.forEach(attachment => {
    const invoice = invoices.find(i => i._id.toString() === attachment._id.toString());
    const fileName = invoice && `${moment(invoice.date).format('YYYY-MM-DD')} - ${invoice.number} - ${invoice.client.name}.pdf`;
    zip.file(fileName || `${attachment._id}.pdf`, attachment.pdf.buffer);
  });

  const zipWithInvoices = await zip.generateAsync({type: 'nodebuffer'});

  res.send(zipWithInvoices);
};

export const addAttachment = async (req: Request, res: Response) => {
  const {id, model, type} = req.params;
  const [file] = req.files as Express.Multer.File[];

  const fileBuffer = file.buffer;

  if (model === 'invoice') {
    const invoice = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOne({_id: new ObjectID(id)});
    const {_id, attachments} = invoice!;
    attachments.push({
      type,
      fileName: file.originalname,
      fileType: file.mimetype,
      lastModifiedDate: new Date().toISOString(),
    });

    await req.db.collection(CollectionNames.INVOICES).findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {attachments}});
    await req.db.collection(CollectionNames.ATTACHMENTS).findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {[type]: fileBuffer}}, {upsert: true});
    return res.send(invoice);
  }

  if (model === 'client') {
    const client = await req.db.collection<IClient>(CollectionNames.CLIENTS).findOne({_id: new ObjectID(id)});
    const {_id, attachments} = client!;
    attachments.push({
      type,
      fileName: file.originalname,
      fileType: file.mimetype,
      lastModifiedDate: new Date().toISOString(),
    });

    await req.db.collection(CollectionNames.CLIENTS).findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {attachments}});
    await req.db.collection(CollectionNames.ATTACHMENTS_CLIENT).findOneAndUpdate({_id}, {$set: {[type]: fileBuffer}}, {upsert: true});
    return res.send(client);
  }

  return res.send('Model not supported');
};

export const deleteAttachment = async (req: Request, res: Response) => {
  const {id, model, type} = req.params;

  if (type === 'pdf' && model === 'invoice') {
    return res.status(500).send('The invoice itself cannot be deleted.');
  }

  if (model === 'client') {
    const client = await req.db.collection<IClient>(CollectionNames.CLIENTS).findOne({_id: new ObjectID(id)});
    const {_id, attachments} = client!;

    const updatedAttachments = attachments.filter(attachment => attachment.type !== type);
    const inserted = await req.db.collection<IClient>(CollectionNames.CLIENTS).findOneAndUpdate({_id}, {$set: {attachments: updatedAttachments}}, {returnOriginal: false});
    const updatedClient = inserted.value;

    await req.db.collection(CollectionNames.ATTACHMENTS_CLIENT).findOneAndUpdate({_id}, {$set: {[type]: undefined}});

    return res.send(updatedClient);
  }

  if (model === 'invoice') {
    const invoice = await req.db.collection<IClient>(CollectionNames.INVOICES).findOne({_id: new ObjectID(id)});
    const {_id, attachments} = invoice!;

    const updatedAttachments = attachments.filter(attachment => attachment.type !== type);
    const inserted = await req.db.collection<IInvoice>(CollectionNames.INVOICES).findOneAndUpdate({_id}, {$set: {attachments: updatedAttachments}}, {returnOriginal: false});
    const updatedInvoice = inserted.value;

    await req.db.collection(CollectionNames.ATTACHMENTS).findOneAndUpdate({_id}, {$set: {[type]: undefined}});

    return res.send(updatedInvoice);
  }

  return res.send('Model not supported');
};
