import Router from 'koa-router';

var ObjectId = require('mongodb').ObjectId;

export default function register(app) {
  const router = new Router({
    prefix: '/api/config'
  });

  router.get('/', function *() {
    this.body = yield this.mongo.collection('config').findOne({name: 'pongit'});
  });

  router.post('/', function *() {
    const {_id, ...params} = this.request.body;
    yield this.mongo.collection('config').update({_id: new ObjectId(_id)}, params);
    this.body = params;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
