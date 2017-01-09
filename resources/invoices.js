import Router from 'koa-router';
import { locals } from '../pug-helpers.js';

const pug = require('pug');
const pdf = require('html-pdf');
const Readable = require('stream').Readable;

function createBase64Pdf(html) {
  return new Promise((resolve, reject) => {
    pdf.create(html).toStream((err, stream) => {
      if (err) {
        reject();
      }

      var base64Stream = this.body = new Readable();
      stream.on('readable', function() {
        const d = stream.read();
        base64Stream.push(d ? d.toString('base64') : null);
      });
      stream.on('end', function() {
        resolve();
      });
    });
  });
}

export default function register(app) {
  // app.set('view engine', 'pug');
  // app.set('views', './templates');
  const router = new Router({
    prefix: '/api/invoices'
  });

  router.post('/preview', function *() {
    const params = this.request.body;
    const compiledFunction = pug.compileFile('./templates/' + params.your.template);
    const html = compiledFunction(Object.assign({}, locals, params, {origin: this.request.origin}));
    yield createBase64Pdf.call(this, html);
  });



  router.post('/create', function *() {
    const params = this.request.body;
    const compiledFunction = pug.compileFile('./templates/' + params.your.template);
    const html = compiledFunction(Object.assign({}, locals, params, {origin: this.request.origin}));

    yield createBase64Pdf.call(this, html);

    const pdfBuffer = yield new Promise((resolve, reject) => {
      pdf.create(html).toBuffer((err, buffer) => {
        if (err) {
          reject();
        }
        resolve(buffer);
      });
    });

    const insertedInvoice = yield this.mongo.collection('invoices').insert(params);
    const insertedInvoiceId = insertedInvoice.insertedIds[1];
    yield this.mongo.collection('pdfs').insert({invoiceId: insertedInvoiceId, pdf: pdfBuffer});

    yield this.mongo.collection('config').update({name: 'pongit'}, {$set: { nextInvoiceNumber: params.number + 1}});
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
