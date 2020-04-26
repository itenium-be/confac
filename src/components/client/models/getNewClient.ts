import {ClientModel} from './ClientModels';
import {ConfigModel} from '../../config/models/ConfigModel';
import {getNewEmail} from '../../controls/email/getNewEmail';
import {defaultConfig} from '../../config/models/getNewConfig';

export function getNewClient(config?: ConfigModel): ClientModel {
  // eslint-disable-next-line no-param-reassign
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
    invoiceFileName: config.invoiceFileName || '{date:YYYY-MM} {nr:4} - {clientName}', // ATTN: Duplicated in default-states
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
    defaultChangingOrderNr: false,
    email: getNewEmail(config.email),
  };
}
