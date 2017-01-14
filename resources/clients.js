import Router from 'koa-router';
import slugify from 'slugify';

export default function register(app) {
  const router = new Router({
    prefix: '/api/clients'
  });

  router.get('/', function *(next) {
    this.body = yield this.mongo.collection('clients').find().toArray();
  });

  router.post('/', function *() {
    var {_id, ...params} = this.request.body;
    if (_id) {
      // console.log('updating', _id, params);
      yield this.mongo.collection('clients').update(_id.toObjectId(), params);
      this.body = this.request.body;

    } else {
      params.slug = slugify(params.name).toLowerCase();

      const inserted = yield this.mongo.collection('clients').insert(params);
      // console.log('inserted', inserted);
      const insertedId = inserted.insertedIds[1];
      this.body = Object.assign(params, insertedId.toString().toObjectId());
    }
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
