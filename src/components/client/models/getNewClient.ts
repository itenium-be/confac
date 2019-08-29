import { ClientModel } from './ClientModels';
import { EditConfigModel } from "../../config/models/ConfigModel";
export function getNewClient(config: EditConfigModel): ClientModel {
  return {
    _id: '',
    slug: '',
    active: true,
    name: '',
    address: '',
    city: '',
    telephone: '',
    btw: '',
    invoiceFileName: '{date:YYYY-MM} {nr:4} - {clientName}',
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
  };
}
