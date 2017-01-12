import Router from 'koa-router';
import { htmlToBuffer, createHtml } from './invoices.js';

export default function register(app) {
  const router = new Router({
    prefix: '/api/attachments'
  });

  router.get('/:invoiceId/:type', function *() {
    const {invoiceId, type} = this.params;
    const attachment = yield this.mongo.collection('attachments').findOne(invoiceId.toObjectId(), {[type]: 1});
    this.body = attachment.pdf;
  });

  router.put('/:invoiceId/:type', function *() {
    const {invoiceId, type} = this.params;
    const params = yield this.mongo.collection('invoices').findOne(invoiceId.toObjectId());

    const html = createHtml(params, this.request.origin);
    const pdfBuffer = yield htmlToBuffer(html);

    yield this.mongo.collection('attachments').update(invoiceId.toObjectId(), {$set: {[type]: pdfBuffer}});

    this.body = 'ok';
  });

  router.put('/:invoiceId/:type', function *() {
    const {invoiceId, type} = this.params;

    console.log(invoiceId, type);

    //const params = yield this.mongo.collection('invoices').findOne(invoiceId.toObjectId());

    //yield this.mongo.collection('attachments').update(invoiceId.toObjectId(), {$set: {[type]: pdfBuffer}});

    this.body = 'ok';
  });


  app.use(router.routes());
  app.use(router.allowedMethods());
}
