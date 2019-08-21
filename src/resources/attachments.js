import Router from 'koa-router';
import body from 'koa-better-body';

function getCollectionName(model) {
  return model === 'client' ? 'clients' : 'invoices';
}

export default function register(app) {
  const router = new Router({
    prefix: '/api/attachments'
  });

  router.get('/:model/:id/:type/:fileName*', function *() {
    const {id, model, type, fileName} = this.params;
    const coll = model === 'client' ? 'attachments_client' : 'attachments';
    const attachment = yield this.mongo.collection(coll).findOne(id.toObjectId(), {[type]: 1});
    this.body = attachment[type].buffer;
    if (type === 'pdf' && !this.query.download) {
      // Open download in-browser in preview mode
      this.type = 'application/pdf';
    } else {
      // Download the file
      this.set('Content-disposition', 'attachment; filename=' + fileName);
    }
  });


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
