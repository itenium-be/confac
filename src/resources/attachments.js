import Router from 'koa-router';
import body from 'koa-better-body';
import moment from 'moment';
import {ObjectId} from 'mongodb';
import JSZip from 'jszip';

function getCollectionName(model) {
  return model === 'client' ? 'clients' : 'invoices';
}

export default function register(app) {
  const router = new Router({
    prefix: '/api/attachments'
  });

  // GET ONE ATTACHMENT
  router.get('/:model/:id/:type/:fileName*', function *() {
    const {id, model, type, fileName} = this.params;
    const coll = model === 'client' ? 'attachments_client' : 'attachments';
    const attachment = yield this.mongo.collection(coll).findOne(id.toObjectId(), {[type]: 1});
    this.body = attachment[type].buffer;
    if (!this.query.download) {
      // Open download in-browser in preview mode
      console.log('infoz', this.params);
      const ext = fileName.substr(fileName.lastIndexOf('.') + 1);
      if (type === 'pdf' || ext === 'pdf') {
        this.type = 'application/pdf';
        return;
      } else if (['png', 'bmp', 'jpg', 'gif'].includes(ext)) {
        this.type = 'image/' + ext;
        return;
      } else if (['html', 'htm'].includes(ext)) {
        this.type = 'text/html';
        return;
      } else if (['ppt'].includes(ext)) {
        this.type = 'application/vnd.ms-powerpoint';
        return;
      } else if (['pptx'].includes(ext)) {
        this.type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        return;
      } else if (['txt'].includes(ext)) {
        this.type = 'text/plain';
        return;
      } else if (['xls'].includes(ext)) {
        this.type = 'application/vnd.ms-excel';
        return;
      } else if (['xlsx', 'xlsm'].includes(ext)) {
        this.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        return;
      } else if (['csv'].includes(ext)) {
        this.type = 'text/csv';
        return;
      } else if (['doc'].includes(ext)) {
        this.type = 'application/msword';
        return;
      } else if (['docx'].includes(ext)) {
        this.type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        return;
      } else if (['odp'].includes(ext)) {
        this.type = 'application/vnd.oasis.opendocument.presentation';
        return;
      } else if (['ods'].includes(ext)) {
        this.type = 'application/vnd.oasis.opendocument.spreadsheet';
        return;
      } else if (['odt'].includes(ext)) {
        this.type = 'application/vnd.oasis.opendocument.text';
        return;
      }
    }

    // Download the file
    if (!fileName) {
      console.log('Downloading a file without knowing the filename', this.params)
    }
    this.set('Content-disposition', 'attachment; filename=' + fileName);
  });

  // CREATE ZIP (with invoices)
  router.post('/', function *() {
    // console.log('body', this.request.body);
    // console.log('att', attachments[0]);

    const invoiceIds = this.request.body.map(i => new ObjectId(i));
    const attachments = yield this.mongo.collection('attachments')
      .find({_id: {$in: invoiceIds}}, {pdf: 1})
      .toArray();

    const invoiceDetails = yield this.mongo.collection('invoices')
      .find({_id: {$in: invoiceIds}})
      .toArray();

    var zip = new JSZip();
    // var img = zip.folder("images");
    for (let attachment of attachments) {
      const invoice = invoiceDetails.find(i => i._id.toString() === attachment._id.toString());
      const fileName = invoice && `${moment(invoice.date).format('YYYY-MM-DD')} - ${invoice.number} - ${invoice.client.name}.pdf`;
      zip.file(fileName || `${attachment._id}.pdf`, attachment.pdf.buffer);
    }

    this.body = yield zip.generateAsync({type: 'nodebuffer'});
    // this.set('Content-disposition', 'attachment; filename=' + fileName);
  });


  // ADD ATTACHMENT
  router.put('/:model/:id/:type', body(), function *() {
    const {id, model, type} = this.params;

    var modelColl = getCollectionName(model);
    var modelObj = yield this.mongo.collection(modelColl).findOne(id.toObjectId());

    const {_id, ...newInvoice} = modelObj;

    // koa-better-body:
    const file = this.request.files[0];
    // console.log(this.request.files[0]);
    // console.log(this.request.fields);

    var fs = require('fs');
    const fileBuffer = fs.readFileSync(file.path);

    newInvoice.attachments.push({
      type,
      fileName: file.name,
      fileType: file.type,
      lastModifiedDate: file.lastModifiedDate
    });
    yield this.mongo.collection(modelColl).update(_id.toString().toObjectId(), newInvoice);

    const coll = model === 'invoice' ? 'attachments' : 'attachments_client';
    yield this.mongo.collection(coll).update(id.toObjectId(), {$set: {[type]: fileBuffer}}, {upsert: true});
    this.body = modelObj;
  });


  // DELETE ATTACHMENT
  router.delete('/:model/:id/:type', body(), function *() {
    const {id, model, type} = this.params;

    const modelColl = getCollectionName(model);
    var modelObj = yield this.mongo.collection(modelColl).findOne(id.toObjectId());
    if (type === 'pdf' && model === 'invoice') {
      this.status = 500;
      this.body = 'cant delete invoice itself';
      return;
    }

    const {_id, ...newObj} = modelObj;
    newObj.attachments = newObj.attachments.filter(att => att.type !== type);
    //console.log('upd', type, newObj.attachments);
    yield this.mongo.collection(modelColl).update(_id.toString().toObjectId(), newObj);

    const coll = model === 'invoice' ? 'attachments' : 'attachments_client';
    yield this.mongo.collection(coll).update(id.toObjectId(), {$set: {[type]: undefined}});
    this.body = Object.assign(newObj, {_id});
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
