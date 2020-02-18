import {ObjectID} from 'mongodb';

import {CollectionNames, IAttachment} from './common';

/** Represents attachments database collection */
export type IAttachmentCollection = {
  /** Corresponds with the invoice ID property */
  _id: any; // Set to any to avoid TS error: https://github.com/Microsoft/TypeScript/issues/8597
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


export interface IAttachmentModelConfig {
  name: string;
  standardCollectionName: string;
  attachmentCollectionName: string;
}

export interface IAttachments {
  _id: ObjectID;
  attachments: IAttachment[];
}

export const attachmentModelsConfig: IAttachmentModelConfig[] = [
  {
    name: 'invoice',
    standardCollectionName: CollectionNames.INVOICES,
    attachmentCollectionName: CollectionNames.ATTACHMENTS,
  },
  {
    name: 'client',
    standardCollectionName: CollectionNames.CLIENTS,
    attachmentCollectionName: CollectionNames.ATTACHMENTS_CLIENT,
  },
  {
    name: 'project_month',
    standardCollectionName: CollectionNames.PROJECTS_MONTH,
    attachmentCollectionName: CollectionNames.ATTACHMENTS,
  },
];
