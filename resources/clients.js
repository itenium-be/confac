import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/clients'
  });

  router.get('/', function *(next) {
    this.body = yield this.mongo.db('confac').collection('clients').find().toArray();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
