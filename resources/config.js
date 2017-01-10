import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/config'
  });

  router.get('/', function *() {
    this.body = yield this.mongo.collection('config').findOne({name: 'pongit'});
  });

  router.post('/', function *() {
    const {_id, ...params} = this.request.body;
    yield this.mongo.collection('config').update(_id.toObjectId(), params);
    this.body = params;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
