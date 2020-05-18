import {EditClientRateType, InvoiceDateStrategy, IAttachment, Attachment, SelectItem, Language} from '../../../models';
import {EmailModel} from '../../controls/email/EmailModels';

export type ClientRateModel = {
  type: EditClientRateType,
  hoursInDay: number,
  value: number,
  description: string,
}

export type ClientModel = IAttachment & {
  _id: string,
  slug: string,
  active: boolean,
  name: string,
  address: string,
  city: string,
  telephone: string,
  btw: string,
  invoiceFileName: string,
  rate: ClientRateModel,
  attachments: Array<Attachment>,
  notes: string,
  defaultInvoiceDateStrategy: InvoiceDateStrategy,
  defaultChangingOrderNr: boolean,
  createdOn?: string,
  email: EmailModel,
  language: Language,
}
