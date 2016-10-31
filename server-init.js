import koa from 'koa';
import koaCors from 'kcors';
import koaBodyParser from 'koa-bodyparser';
import koaServe from 'koa-static';

export const createApp = () => {
  const app = koa();
  app.use(koaCors());
  app.use(koaBodyParser());
  app.use(koaServe('./templates/'));

  require('./resources/config.js').default(app);
  require('./resources/clients.js').default(app);
  require('./resources/invoices.js').default(app);

  return app;
};
