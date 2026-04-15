// backend/src/faker/data/config.ts
// Real itenium config with test overrides:
// - name: "itenium BV" -> "itenium TEST"
// - all real emails replaced with itenium@pongit.be
// - exactonline inbox replaced
// - bic whitespace stripped
// defaultClient is set after clients are inserted (see insertStuff.ts).

export const ITENIUM_TEST_CONFIG = {
  key: 'conf',
  company: {
    template: 'itenium.pug',
    name: 'itenium TEST',
    address: 'Pilatusveld 7',
    city: 'Londerzeel',
    btw: 'BE0687800967',
    bank: 'KBC',
    iban: 'BE84 7370 4817 1859',
    bic: 'KREDBEBB',
    telephone: '0477 54 89 57',
    email: 'itenium@pongit.be',
    website: 'https://itenium.be',
    templateQuotation: 'itenium-signable.pug',
    rpr: 'Brussel',
    postalCode: '1840',
  },
  defaultClient: null as string | null,
  template: 'itenium.pug',
  templateQuotation: 'itenium - offerte.pug',
  invoiceFileName: 'Factuur {{zero nr 4}} - {{formatDate date "YYYY-MM-DD"}} - {{clientName}}',
  attachmentTypes: ['Getekende timesheet', 'Factuur freelancer'],
  defaultExtraClientFields: [],
  defaultExtraClientInvoiceFields: [],
  defaultExtraInvoiceFields: [],
  showOrderNr: true,
  groupInvoiceListByMonth: false,
  defaultInvoiceDateStrategy: 'prev-month-last-day',
  invoicePayDays: 30,
  email: {
    to: '',
    cc: '',
    bcc: 'itenium@pongit.be',
    subject: 'Factuur {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}}',
    // eslint-disable-next-line max-len
    body: '<p>Dear,</p>\n<p>Please find invoice {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} and signed timesheet in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</p>\n',
    attachments: ['Getekende timesheet', 'pdf'],
    from: 'itenium@pongit.be',
  },
  // eslint-disable-next-line max-len
  emailSignature: '<p><br>Best regards,<br><br><span style="color: rgb(231,130,0);font-size: 13px;font-family: monospace;">Team Finance</span><br><a href="mailto:itenium@pongit.be" target="_self"><span style="color: rgb(126,126,126);font-size: 13px;font-family: monospace;">itenium@pongit.be</span></a><br><a href="tel:+32476403502" target="_self"><span style="color: rgb(126,126,126);font-size: 13px;font-family: monospace;">+32 15 79 46 89</span></a><br><a href="https://itenium.be" target="_self"><span style="color: rgb(126,126,126);font-size: 13px;font-family: monospace;">www.itenium.be</span></a>&nbsp;</p>\n<div style="text-align:left;"><img src="https://raw.githubusercontent.com/itenium-be/marketing/refs/heads/master/email-signature/itenium-logo-cropped.png" alt="itenium" style="height: auto;width: 100px"/></div>\n',
  // eslint-disable-next-line max-len
  emailReminder: '<p>Dear,<br><br>According to our records, invoice {{nr}} from {{formatDate projectMonth "MMMM YYYY"}} has not yet been paid<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}{{/if}}</p>\n',
  extraConfigFields: [],
  emailAttachments: ['Getekende timesheet'],
  defaultInvoiceLines: [
    {
      desc: 'Consultancy diensten',
      amount: 0,
      type: 'daily',
      price: 0,
      tax: 21,
      sort: 0,
    },
  ],
  emailReminderBcc: 'itenium@pongit.be',
  emailReminderCc: '',
  language: 'en',
  attachments: [],
  emailInvoiceOnly: 'itenium@pongit.be',
  initialMonthLoad: 18,
  // eslint-disable-next-line max-len
  emailCreditNotaBody: '<p>Dear,</p>\n<p>Please find credit note {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</p>',
  emailCreditNotaSubject: 'Credit Note {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}}',
  // eslint-disable-next-line max-len
  emailPeppolDuplicateBody: '<p style="text-align:start;"><span style="color: rgb(33,37,41);background-color: rgb(255,255,255);font-size: 16px;font-family: Lato, serif;">Dear,</span></p>\n<p style="text-align:start;"><span style="color: rgb(33,37,41);background-color: rgb(255,255,255);font-size: 16px;font-family: Lato, serif;">Please find invoice {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} and signed timesheet in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</span> <br><br>This is a duplicate. The invoice has been sent to Peppol.</p>\n',
  // eslint-disable-next-line max-len
  emailPeppolDuplicateSubject: 'Factuur {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}} (duplicaat)',
  peppolPivotDate: '2026-01-01T00:00:00.000Z',
  audit: {
    createdOn: new Date().toISOString(),
    createdBy: 'faker',
    modifiedOn: '',
    modifiedBy: '',
  },
};

/** Slug of the client to set as config.defaultClient after insertion. */
export const DEFAULT_CLIENT_SLUG = 'cegeka';
