import Router from 'koa-router';
import fs from 'fs';
import {getTemplatesPath} from './invoices.js';

export default function register(app) {
  const router = new Router({
    prefix: '/api/config'
  });

  router.get('/', function *() {
    const conf = yield this.mongo.collection('config').findOne({key: 'conf'});
    if (!conf) {
      this.body = {
        key: 'conf',
        company: {
          template: 'example-1.pug',
          name: 'Jouw bedrijfsnaam',
          address: 'Streetname 15',
          city: '9000 Brussel',
          btw: '0000.000.000',
          bank: 'Banknaam',
          iban: 'BE00 0000 0000 0000',
          bic: 'GKCCBEAD',
          telephone: '0000 / 00 00 00',
          email: 'ceo@yahoo.com',
          website: 'www.clicky-me-IT.be'
        },
        defaultClient: null,
        defaultTax: 21,
        attachmentTypes: ['Getekende timesheet'],
        defaultExtraClientFields: [],
        defaultExtraClientInvoiceFields: [],
        showOrderNr: false,
        groupInvoiceListByMonth: false,
        defaultInvoiceLineType: 'daily',
        defaultInvoiceDateStrategy: 'prev-month-last-day',
        email: {
          to: '',
          cc: '',
          bcc: '',
          subject: '',
          body: '',
          attachments: []
        },
        emailSignature: '',
        emailReminder: ''
      };
    } else {
      this.body = conf;
    }
  });

  router.post('/', function *() {
    const {_id, ...params} = this.request.body;
    if (_id) {
      yield this.mongo.collection('config').update(_id.toObjectId(), params);
      this.body = Object.assign(params, _id.toObjectId());

    } else {
      const inserted = yield this.mongo.collection('config').insert(params);
      // console.log('inserted', inserted);
      const insertedId = inserted.insertedIds[1];
      this.body = Object.assign(params, insertedId.toString().toObjectId());
    }
  });

  router.get('/templates', function *() {
    this.body = fs.readdirSync(getTemplatesPath()).filter(fileName => fileName.endsWith('.pug'));
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
