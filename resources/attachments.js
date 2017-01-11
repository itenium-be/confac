import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/attachments'
  });

  router.get('/:invoiceId/:type', function *() {
    const {invoiceId, type} = this.params;
    const attachment = yield this.mongo.collection('attachments').findOne(invoiceId.toObjectId(), {[type]: 1});
    this.body = attachment.pdf;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
