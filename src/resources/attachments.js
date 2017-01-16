import Router from 'koa-router';
import {htmlToBuffer, createHtml} from './invoices.js';
import body from 'koa-better-body';

export default function register(app) {
  const router = new Router({
    prefix: '/api/attachments'
  });

  router.get('/:invoiceId/:type', function *() {
    const {invoiceId, type} = this.params;
    const attachment = yield this.mongo.collection('attachments').findOne(invoiceId.toObjectId(), {[type]: 1});
    this.body = attachment[type];
  });

  router.put('/:invoiceId/:type', body(), function *() {
    const {invoiceId, type} = this.params;

    var invoice = yield this.mongo.collection('invoices').findOne(invoiceId.toObjectId());

    var fileBuffer;
    if (type === 'pdf') {
      const html = createHtml(invoice, this.request.origin);
      fileBuffer = yield htmlToBuffer(html);

    } else {
      const {_id, ...newInvoice} = invoice;

      // koa-better-body:
      const {path} = this.request.files[0];
      // console.log(this.request.files[0]);
      // console.log(this.request.fields);

      // o'rly?
      var fs = require('fs');
      fileBuffer = fs.readFileSync(path);

      newInvoice.attachments.push(type);
      yield this.mongo.collection('invoices').update(_id.toString().toObjectId(), newInvoice);
    }

    yield this.mongo.collection('attachments').update(invoiceId.toObjectId(), {$set: {[type]: fileBuffer}});

    this.body = invoice;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
