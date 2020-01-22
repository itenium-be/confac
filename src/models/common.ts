const emailSchema = {
  from: String,
  to: String,
  cc: String,
  bcc: String,
  subject: String,
  body: String,
  attachments: [String],
};

const clientSchema = {
  _id: String,
  slug: String,
  active: Boolean,
  name: String,
  address: String,
  city: String,
  telephone: String,
  btw: String,
  invoiceFileName: String,
  rate: {
    type: {type: String},
    hoursInDay: Number,
    value: Number,
    description: String,
  },
  attachments: [
    {
      type: {type: String},
      fileName: String,
      fileType: String,
      lastModifiedDate: String,
    }],
  extraFields: [{
    label: String || Number,
    value: String || Number,
    className: String,
  }],
  defaultExtraInvoiceFields: [{
    label: String || Number,
    value: String || Number,
    className: String,
  }],
  notes: String,
  defaultInvoiceDateStrategy: String,
  createdOn: String,
  email: emailSchema,
};

const common = {
  clientSchema,
  emailSchema,
};

export default common;