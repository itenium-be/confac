import {ClientModel} from './ClientModels';
import {ConfigModel} from '../../config/models/ConfigModel';
import {getNewEmail} from '../../controls/email/getNewEmail';
import {defaultConfig, defaultCommunicationLanguage} from '../../config/models/getNewConfig';
import {IAudit} from '../../../models';

export const DefaultHoursInDay = 8;

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
    invoiceFileName: '',
    hoursInDay: DefaultHoursInDay,
    defaultInvoiceLines: [],
    attachments: [],
    notes: '',
    defaultInvoiceDateStrategy: config.defaultInvoiceDateStrategy,
    defaultChangingOrderNr: false,
    email: {...getNewEmail(config.email), combineAttachments: false},
    language: config.language || defaultCommunicationLanguage,
    audit: {} as IAudit,
  };
}
