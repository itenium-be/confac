import Router from 'koa-router';
import slugify from 'slugify';
import fetch from 'node-fetch';

export default function register(app) {
  const router = new Router({
    prefix: '/api/clients'
  });

  router.get('/', function *(next) {
    this.body = yield this.mongo.collection('clients').find().toArray();
  });

  router.get('/btw/:btw', function *(next) {
    const result = yield fetch(`https://controleerbtwnummer.eu/api/validate/${this.params.btw}.json`, {mode: 'no-cors'})
      .then(res => res.json());
    this.body = result;
  });

  router.post('/', function *() {
    var {_id, ...params} = this.request.body;
    if (_id) {
      // console.log('updating', _id, params);
      yield this.mongo.collection('clients').update(_id.toObjectId(), params);
      this.body = this.request.body;

    } else {
      params.slug = slugify(params.name).toLowerCase();
      params = {...params, createdOn: new Date().toISOString()}; //to prevent value provided is not in a recognized RFC2822 or ISO format

      const inserted = yield this.mongo.collection('clients').insert(params);

      const insertedId = inserted.insertedIds[1];
      this.body = Object.assign(params, insertedId.toString().toObjectId());
    }
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
