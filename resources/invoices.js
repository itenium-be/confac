import Router from 'koa-router';
import {locals} from '../pug-helpers.js';

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

export function htmlToBuffer(html) {
  return new Promise((resolve, reject) => {
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        console.log('htmlToBuffer error', err); // eslint-disable-line
        reject();
      }

      resolve(buffer);
    });
  });
}

export function createHtml(params, assetsPath) {
  const compiledFunction = pug.compileFile('./templates/' + params.your.template);
  return compiledFunction(Object.assign({}, locals, params, {origin: assetsPath}));
}

export default function register(app) {
  const router = new Router({
    prefix: '/api/invoices'
  });

  router.get('/', function *() {
    this.body = yield this.mongo.collection('invoices').find().toArray();
  });

  router.put('/', function *() {
    const {_id, ...params} = this.request.body;
    yield this.mongo.collection('invoices').update(_id.toObjectId(), params);
    // TODO: updateInvoice: property to mark that pdf is no longer in sync with invoice data?
    this.body = this.request.body;
  });

  router.delete('/', function *() {
    const id = this.request.body.id;
    yield this.mongo.collection('invoices').remove(id.toObjectId());
    yield this.mongo.collection('attachments').remove(id.toObjectId());
    this.body = id;
  });

  router.post('/preview', function *() {
    const params = this.request.body;
    const html = createHtml(params, this.request.origin);
    yield createBase64Pdf.call(this, html);
  });

  router.post('/', function *() {
    const params = this.request.body;
    const html = createHtml(params, this.request.origin);
    const pdfBuffer = yield htmlToBuffer(html);

    const insertedInvoice = yield this.mongo.collection('invoices').insert(params);
    const insertedInvoiceId = insertedInvoice.insertedIds[1];

    this.body = yield this.mongo.collection('invoices').findOne({_id: insertedInvoiceId});

    yield this.mongo.collection('attachments').insert({_id: insertedInvoiceId, pdf: pdfBuffer});
    yield this.mongo.collection('config').update({name: 'pongit'}, {$set: { nextInvoiceNumber: params.number + 1}});
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
