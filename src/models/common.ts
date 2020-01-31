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
  }],
  defaultExtraInvoiceFields: [{
    label: String || Number,
    value: String || Number,
  }],
  notes: String,
  defaultInvoiceDateStrategy: String,
  createdOn: Date,
  email: emailSchema,
};

export interface IEmailAttachment {
  type: string;
  fileName: string;
  fileType: string;
  lastModifiedDate?: string;
}

export default {
  emailSchema,
  clientSchema,
};