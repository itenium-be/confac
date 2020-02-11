import {ObjectID} from 'mongodb';

export type IAttachment = {
  /** Corresponds with the invoice ID property */
  _id: ObjectID;
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
