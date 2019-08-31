import Router from 'koa-router';
import {locals} from '../pug-helpers.js';
import pug from 'pug';
import pdf from 'html-pdf';
import moment from 'moment';

function * createPdf(params, config) {
  const html = createHtml(params, config);

  if (html.error) {
    this.body = html.error;
    this.status = 500;
    return;
  }

  const pdfBuffer = yield htmlToBuffer(html);
  return pdfBuffer;
}


export default function register(app, config) {
  const router = new Router({
    prefix: '/api/invoices'
  });

  router.get('/', function *() {
    this.body = yield this.mongo.collection('invoices').find().toArray();
  });

  router.post('/', function *() {
    let params = this.request.body;

    if (!params.isQuotation) {
      let last = yield this.mongo.collection('invoices')
        .find({ isQuotation: false})
        .sort({ number: -1 })
        .limit(1)
        .toArray();

      if (last.length > 0) {
        last = last[0];
        if (params.number <= last.number) {
          this.status = 400;
          // BUG: reload: true ==> invoices list reloads which triggers componentWillReceiveProps of EditInvoice.js
          // BUG: Without the invoice list check in componentWillReceiveProps, it doesn't work when opening an invoice
          // BUG: by directly pasting the url in the browser
          this.body = { msg: 'invoice.badRequest.nrExists', data: {nr: params.number, lastNr: last.number}, reload: false};
          return;
        } else if (moment(params.date).startOf('day') < moment(last.date).startOf('day')) {
          this.status = 400;
          this.body = {
            msg: 'invoice.badRequest.dateAfterExists',
            data: {
              lastNr: last.number,
              date: moment(params.date).format('DD/MM/YYYY'),
              lastDate: moment(last.date).format('DD/MM/YYYY'),
            }
          };
          return;
        }
      }
    }

    const pdfBuffer = yield createPdf.call(this, params, config);

    params = {...params, createdOn : new Date().toISOString()};
    const insertedInvoice = yield this.mongo.collection('invoices').insert(params);
    const insertedInvoiceId = insertedInvoice.insertedIds[1];

    this.body = yield this.mongo.collection('invoices').findOne({_id: insertedInvoiceId});

    yield this.mongo.collection('attachments').insert({_id: insertedInvoiceId, pdf: pdfBuffer});
    //yield this.mongo.collection('config').update({name: 'pongit'}, {$set: { nextInvoiceNumber: params.number + 1}});
  });

  router.put('/', function *() {
    const {_id, ...params} = this.request.body;
    yield this.mongo.collection('invoices').update(_id.toObjectId(), params);

    const pdfBuffer = yield createPdf.call(this, params, config);
    yield this.mongo.collection('attachments').update(_id.toObjectId(), {$set: {'pdf': pdfBuffer}}, {upsert: true});

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
    const pdfBuffer = yield createPdf.call(this, params, config);
    this.body = pdfBuffer;
    this.type = 'application/pdf';

    // const html = createHtml(params, config);
    // yield createBase64Pdf.call(this, html);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}


export function getTemplatesPath() {
  if (process.env.ENABLE_ROOT_TEMPLATES) {
    return '/templates/';
  } else {
    return './templates/';
  }
}


export function createHtml(params, config) {
  // BUG: extraFields was an array [{key, value}, {}, ...]
  // But this code converted it to an object {key1, key2, ...}
  // Was saved like this in the db and then crashed because Object.prototype doesn't have a reduce function
  params = JSON.parse(JSON.stringify(params));
  if (params.extraFields) {
    params.extraFields = params.extraFields.reduce((acc, cur) => {
      acc[cur.label.toLowerCase()] = cur.value;
      return acc;
    }, {});
  }

  var compiledFunction;
  try {
    const templateType = params.isQuotation ? params.your.templateQuotation : params.your.template;
    compiledFunction = pug.compileFile(getTemplatesPath() + templateType);
  } catch (e) {
    console.log('TemplateNotFound', e); // eslint-disable-line
    return {error: 'TemplateNotFound'};
  }

  const assetsPath = 'http://' + config.server.host + ':' + config.server.port;
  return compiledFunction(Object.assign({}, locals, params, {origin: assetsPath}));
}

// https://www.npmjs.com/package/html-pdf
// const options = {
//   base: '/templates/'
// };

export function htmlToBuffer(html) {
  return new Promise((resolve, reject) => {
    pdf.create(html/*, options*/).toBuffer((err, buffer) => {
      if (err) {
        console.log('htmlToBuffer error', err); // eslint-disable-line
        reject();
      }

      resolve(buffer);
    });
  });
}


// function createBase64Pdf(html) {
//   return new Promise((resolve, reject) => {
//     pdf.create(html).toStream((err, stream) => {
//       if (err) {
//         reject();
//       }

//       const Readable = require('stream').Readable;
//       var base64Stream = this.body = new Readable();
//       stream.on('readable', function() {
//         const d = stream.read();
//         base64Stream.push(d ? d.toString('base64') : null);
//       });
//       stream.on('end', function() {
//         resolve();
//       });
//     });
//   });
// }
