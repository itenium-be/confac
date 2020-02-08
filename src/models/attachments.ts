import mongoose from 'mongoose';

export type IAttachment = {
  /** Corresponds with the invoice ID property */
  _id: string;
  /** The invoice pdf */
  pdf: Buffer;
} & { // <-- to avoid TypeScript error
  /** User uploaded attachments */
  [attachmentKey: string]: Buffer;
}

export interface ISendGridAttachment {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
}

const attachmentSchema = new mongoose.Schema({pdf: Buffer});
const attachmentClientSchema = new mongoose.Schema({pdf: Buffer});

export const AttachmentsCollection = mongoose.model<IAttachment & mongoose.Document>('attachment', attachmentSchema, 'attachments');
export const AttachmentsClientCollection = mongoose.model<IAttachment & mongoose.Document>('attachment_client', attachmentClientSchema, 'attachments_client');