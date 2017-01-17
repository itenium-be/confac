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
      const file = this.request.files[0];
      // console.log(this.request.files[0]);
      // console.log(this.request.fields);

      // o'rly?
      var fs = require('fs');
      fileBuffer = fs.readFileSync(file.path);

      newInvoice.attachments.push({
        type,
        fileName: file.name,
        fileType: file.type,
        lastModifiedDate: file.lastModifiedDate
      });
      yield this.mongo.collection('invoices').update(_id.toString().toObjectId(), newInvoice);
    }

    yield this.mongo.collection('attachments').update(invoiceId.toObjectId(), {$set: {[type]: fileBuffer}});

    this.body = invoice;
  });


  router.delete('/:invoiceId/:type', body(), function *() {
    const {invoiceId, type} = this.params;

    var invoice = yield this.mongo.collection('invoices').findOne(invoiceId.toObjectId());
    if (type === 'pdf') {
      this.status = 500;
      this.body = 'cant delete invoice itself';
      return;
    }

    const {_id, ...newInvoice} = invoice;
    newInvoice.attachments = newInvoice.attachments.filter(att => att.type !== type);
    //console.log('upd', type, newInvoice.attachments);
    yield this.mongo.collection('invoices').update(_id.toString().toObjectId(), newInvoice);
    yield this.mongo.collection('attachments').update(invoiceId.toObjectId(), {$set: {[type]: undefined}});
    this.body = Object.assign(newInvoice, {_id});
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
