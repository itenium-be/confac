import { ClientModel } from './ClientModels';
import { ConfigModel } from "../../config/models/ConfigModel";
import { getNewEmail, defaultConfig } from '../../../reducers/default-states';

export function getNewClient(config?: ConfigModel): ClientModel {
  config = config || defaultConfig;
  return {
    _id: '',
    slug: '',
    active: true,
    name: '',
    address: '',
    city: '',
    telephone: '',
    btw: '',
    invoiceFileName: config.invoiceFileName || '{date:YYYY-MM} {nr:4} - {clientName}',  // ATTN: Duplicated in default-states
    rate: {
      type: config.defaultInvoiceLineType,
      hoursInDay: 8,
      value: 0,
      description: '',
    },
    attachments: [],
    extraFields: config.defaultExtraClientFields.slice(),
    defaultExtraInvoiceFields: config.defaultExtraClientInvoiceFields.slice(),
    notes: '',
    defaultInvoiceDateStrategy: config.defaultInvoiceDateStrategy,
    email: getNewEmail(config.email),
  };
}
