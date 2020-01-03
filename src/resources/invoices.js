import Router from 'koa-router';
import {locals} from '../pug-helpers.js';
import pug from 'pug';
import pdf from 'html-pdf';
import moment from 'moment';
import {ObjectId} from 'mongodb';
import sgMail from '@sendgrid/mail';
import PDFMerge from 'pdf-merge';
import fs from 'fs';
import tmp from 'tmp';


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

  router.post('/email/:id', function *() {
    // console.log('emailing', this.request.body);

    const invoiceId = this.params.id;

    const attachments = this.request.body.attachments
      .map(a => a.type)
      .reduce((acc, cur) => {
        acc[cur] = 1;
        return acc;
      }, {});

    const attachmentBuffers = yield this.mongo.collection('attachments')
      .findOne(invoiceId.toObjectId(), attachments);

    let emailAttachments;
    if (this.request.body.combineAttachments) {
      // Merge all attachments into one pdf
      const canMerge = this.request.body.attachments.every(a => a.fileType === 'application/pdf');
      if (!canMerge) {
        this.throw(400, 'Emailing with combineAttachments=true: Can only merge pdfs');
      }

      // Make sure the invoice is the first document in the merged pdf
      this.request.body.attachments.sort((a, b) => a.type === 'pdf' ? -1 : b.type === 'pdf' ? 1 : 0);

      const files = [];
      this.request.body.attachments.forEach(a => {
        const tmpFile = tmp.fileSync();
        fs.writeSync(tmpFile.fd, attachmentBuffers[a.type].buffer);
        files.push(tmpFile);
      });

      console.log('Merging pdfs', files.map(f => f.name));
      const buffer = yield PDFMerge(files.map(f => f.name));

      const invoiceAttachment = this.request.body.attachments.find(a => a.type === 'pdf');
      emailAttachments = [{
        content: buffer.toString('base64'),
        fileName: invoiceAttachment.fileName,
        type: invoiceAttachment.fileType,
        disposition: 'attachment',
      }];

      files.forEach(f => f.removeCallback());

    } else {
      emailAttachments = this.request.body.attachments.map(a => {
        return {
          content: attachmentBuffers[a.type].buffer.toString('base64'),
          fileName: a.fileName,
          type: a.fileType,
          disposition: 'attachment',
        };
      });
    }

    const email = this.request.body;
    const msg = {
      to: email.to.split(';'),
      cc: email.cc.split(';'),
      bcc: email.bcc.split(';'),
      from: email.from,
      subject: email.subject,
      // text: '', // TODO: Send body stripped from html?
      html: email.body,
      attachments: emailAttachments,
    };
    yield sgMail.send(msg)
      .then(() => {
        console.log('Mail sent successfully');
      })
      .catch(error => {
        console.error(error);
        if (error.code === 401) {
          this.status = 400;
          this.body = [{message: 'Has the SendGrid API Key been set?'}];
        } else {
          this.status = 400;
          this.body = error.response.body.errors;
        }
      });

    if (this.status !== 400) {
      const lastEmailSent = new Date();
      yield this.mongo.collection('invoices').update(
        invoiceId.toObjectId(),
        {$set: {lastEmail: lastEmailSent}}
      );
      this.status = 200;
      this.body = lastEmailSent;
    }
  });

  router.post('/excel', function *() {
    // console.log('heh', this.request.body);

    const invoiceIds = this.request.body.map(i => new ObjectId(i));
    const invoices = yield this.mongo.collection('invoices')
      .find({_id: {$in: invoiceIds}})
      .toArray();

    const separator = ';';
    const headers = ['Number', 'Date', 'Client name', 'Order nr', 'Without Tax', 'Tax', 'Total', 'Verified', 'Discount', 'First line desc', 'Id']

    this.body = headers.join(separator) + '\r\n' + invoices.map(i => {
      return [
        i.number,
        moment(i.date).format('YYYY-MM-DD'),
        i.client.name,
        i.orderNr,
        i.money.totalWithoutTax.toString().replace('.', ','),
        i.money.totalTax.toString().replace('.', ','),
        i.money.total.toString().replace('.', ','),
        i.verified,
        i.money.discount.toString().replace('.', ','),
        `"${i.lines[0].desc}"`,
        i._id,
      ].join(separator);
    }).join('\r\n');
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
