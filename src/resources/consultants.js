import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/consultants'
  });

  router.get('/', function* () {
    this.body = yield this.mongo.collection('consultants').find().toArray();
  })

  router.post('/', function* () {
    const newConsultant = { ...this.request.body, createdOn: new Date().toISOString() };

    const inserted = yield this.mongo.collection('consultants').insert(newConsultant);

    const insertedId = inserted.insertedIds[1];
    this.body = Object.assign(newConsultant, insertedId.toString().toObjectId());
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
