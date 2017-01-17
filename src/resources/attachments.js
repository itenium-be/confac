import Router from 'koa-router';
import {htmlToBuffer, createHtml} from './invoices.js';
import body from 'koa-better-body';

export default function register(app) {
  const router = new Router({
    prefix: '/api/attachments'
  });

  router.get('/:model/:id/:type', function *() {
    const {id, model, type} = this.params;
    const coll = model === 'invoice' ? 'attachments' : 'attachments_client';
    const attachment = yield this.mongo.collection(coll).findOne(id.toObjectId(), {[type]: 1});
    this.body = attachment[type];
  });


  router.put('/:model/:id/:type', body(), function *() {
    const {id, model, type} = this.params;

    const modelColl = model === 'invoice' ? 'invoices' : 'clients';
    var modelObj = yield this.mongo.collection(modelColl).findOne(id.toObjectId());

    var fileBuffer;
    if (type === 'pdf' && model === 'invoice') {
      const html = createHtml(modelObj, this.request.origin);
      fileBuffer = yield htmlToBuffer(html);

    } else {
      const {_id, ...newInvoice} = modelObj;

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
      yield this.mongo.collection(modelColl).update(_id.toString().toObjectId(), newInvoice);
    }

    const coll = model === 'invoice' ? 'attachments' : 'attachments_client';
    yield this.mongo.collection(coll).update(id.toObjectId(), {$set: {[type]: fileBuffer}}, {upsert: true});
    this.body = modelObj;
  });


  router.delete('/:model/:id/:type', body(), function *() {
    const {id, model, type} = this.params;

    const modelColl = model === 'invoice' ? 'invoices' : 'clients';
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
