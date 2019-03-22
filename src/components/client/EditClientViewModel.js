
export function getNewClient(config) {
  return {
    _id: null,
    slug: null,
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
    createdOn: new Date().getTime()
  };
}

// Used by the ClientModal
export const requiredClientProperties = [
  {key: 'name'},
  {key: 'address'},
  {key: 'city'},
  {key: 'telephone'},
  {key: 'btw'},
];

export const defaultClientProperties = [{
  key: 'name',
}, {
  key: 'slug',
  updateOnly: true,
}, {
  key: 'btw',
}, {
  key: 'address',
}, {
  key: 'city',
}, {
  key: 'telephone',
}, {
  key: 'contact',
}, {
  key: 'contactEmail',
}];
