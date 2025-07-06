var objectid = require('objectid');

module.exports = {
  async up(db) {
    await db.collection('config').updateOne({key: 'conf'}, { $set: {
      invoiceFileName: 'Factuur {{zero nr 4}} - {{formatDate date "YYYY-MM-DD"}} - {{clientName}}',
      'email.subject': 'Factuur {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}}',

      'email.body': '<p>Dear,</p>\n<p>Please find invoice {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} and signed timesheet in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</p>',

      emailReminder: 'Dear,\n<p>According to our records, invoice {{nr}} from {{formatDate projectMonth "MMMM YYYY"}} has not yetbeen paid<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}{{/if}}</p>',

      emailCreditNotaSubject: 'Credit Note {{nr}} - {{formatDate projectMonth "YYYY-MM"}}{{#if consultantName}} - {{consultantName}}{{/if}}',
      emailCreditNotaBody: '<p>Dear,</p>\n<p>Please find credit note {{nr}} for {{formatDate projectMonth "MMMM YYYY"}} in attachment.<br>{{#if consultantName}}Consultant: {{consultantName}}<br>{{/if}}{{#if orderNr}}Order nr: {{orderNr}}<br>{{/if}}{{#if creditNotes}}Linked invoices: {{creditNotes}}{{/if}}</p>',
    }});

    // fixes for clients
    // db.clients.find({invoiceFileName: { $exists: true, $ne: "" }})
    await db.collection('clients').updateOne({_id: objectid('62837f5b90c9f95f1a7c1f94')}, { $set: {
      invoiceFileName: 'BI341382 M{{formatDate date "MM YYYY"}}'
    }});

    // db.clients.find({'email.subject': { $exists: true, $ne: "" }})
    await db.collection('clients').updateOne({'email.subject': { $exists: true, $ne: "" }}, { $set: {
      'email.subject': '',
    }});

    // db.clients.find({'email.body': { $exists: true, $ne: "" }}, { name: 1, 'email.body': 1 })
    // Deleted manually from production db.
  },

  async down(db) {}
};
