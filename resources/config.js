import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/config'
  });

  router.get('/', function *(next) {
    this.body = yield this.mongo.collection('config').findOne({name: 'pongit'});
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
