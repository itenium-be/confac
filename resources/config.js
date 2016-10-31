import Router from 'koa-router';

export default function register(app) {
  const router = new Router({
    prefix: '/api/config'
  });

  router.get('/', function *(next) {
    this.body = {
      nextInvoiceNumber: 11,
      defaultClient: 2,
    };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
