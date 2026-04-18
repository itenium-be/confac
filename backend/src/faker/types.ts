import {ObjectID} from 'mongodb';

export type Country = 'BE' | 'NL' | 'FR' | 'UK';
export type Language = 'nl' | 'fr' | 'en';
export type ClientTypeTag = 'partner' | 'client' | 'endCustomer';
export type ConsultantType = 'manager' | 'consultant' | 'freelancer' | 'externalConsultant';
export type ContractStatus = 'NoContract' | 'Sent' | 'Verified' | 'WeSigned' | 'TheySigned' | 'BothSigned' | 'NotNeeded';
export type ProjectProforma = 'no' | 'inboundWithTax' | 'inboundWithoutTax' | 'outboundWithTax' | 'outboundWithoutTax';

export type ClientRow = {
  slug: string;
  name: string;
  btw: string;
  street: string;
  streetNr: string;
  streetBox?: string;
  postalCode: string;
  city: string;
  country: Country;
  language: Language;
  contact: string;
  telephone: string;
  peppolEnabled?: boolean;
  frameworkAgreementStatus?: ContractStatus;
};

export type ConsultantRow = {
  slug: string;
  firstName: string;
  lastName: string;
  type: ConsultantType;
  telephone: string;
  partnerSlug?: string;
};

export type ProjectRow = {
  consultantSlug: string;
  clientSlug: string;
  partnerSlug?: string;
  endCustomerSlug?: string;
  startDate: string;
  endDate?: string;
  ref?: string;
  contractStatus: ContractStatus;
  advancedInvoicing?: boolean;
  clientPrice?: number;
  partnerPrice?: number;
  changingOrderNr?: boolean;
  proforma?: ProjectProforma;
};

/** slug -> inserted Mongo _id, used by buildProject */
export type SlugIdMap = Map<string, ObjectID>;

export type BuildProjectMaps = {
  clientIds: SlugIdMap;
  consultantIds: SlugIdMap;
  consultantTypes: Map<string, ConsultantType>;
};
