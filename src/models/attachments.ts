import mongoose from 'mongoose';

export interface IAttachment {
  _id: string;
  pdf: Buffer;
}

const attachmentSchema = new mongoose.Schema({pdf: Buffer});

export const AttachmentsCollection = mongoose.model<IAttachment & mongoose.Document>('attachment', attachmentSchema, 'attachments');