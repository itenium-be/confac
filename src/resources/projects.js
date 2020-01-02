import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/projects'
  });

  router.get('/', function* () {
    this.body = yield this.mongo.collection('projects').find().toArray();
  })

  router.post('/', function* () {
    const newProject = { ...this.request.body, createdOn: new Date().toISOString() };

    const inserted = yield this.mongo.collection('projects').insert(newProject);

    const insertedId = inserted.insertedIds[1];
    this.body = Object.assign(newProject, insertedId.toString().toObjectId());
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
