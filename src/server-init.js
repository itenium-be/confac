import koa from 'koa';
import koaCors from 'kcors';
import koaBodyParser from 'koa-bodyparser';
import koaServe from 'koa-static';
import koaSend from 'koa-send';
import koaMongo from 'koa-mongo';

const ObjectId = require('mongodb').ObjectId;
String.prototype.toObjectId = function(key = '_id') {
  return {[key]: new ObjectId(this)};
};

export const createApp = config => {
  const app = koa();

  app.use(function *(next) {
    try {
      yield next;
    } catch (err) {
      this.status = err.statusCode || err.status || 500;
      console.error(err); // eslint-disable-line
      this.body = {message: err.message, stack: err.stack};
    }
  });

  // var delay = require('koa-delay');
  // app.use(delay(1000, 20));

  app.use(koaCors());
  app.use(koaBodyParser());
  // app.use(koaServe(__dirname + '../public'));
  app.use(koaServe(`./${config.server.basePath}public`));
  if (process.env.ENABLE_ROOT_TEMPLATES) {
    app.use(koaServe('/templates'));
  } else {
    app.use(koaServe(`./${config.server.basePath}templates`));
  }

  const db = config.db;
  app.use(koaMongo({
    uri: `mongodb://${db.host}:${db.port}/${db.db}`,
    max: 100,
    min: 1,
    timeout: 30000,
    log: false
  }));

  require('./resources/config.js').default(app);
  require('./resources/clients.js').default(app);
  require('./resources/invoices.js').default(app, config);
  require('./resources/attachments.js').default(app);

  app.use(function *pageNotFound(next) {
    yield next;

    if (this.status !== 404) {
      return;
    }

    this.status = 404;
    console.log('404', this.req.url); // eslint-disable-line

    if (this.req.url.startsWith('/api')) {
      this.body = {message: 'Page Not Found: ' + this.req.url};
      return;
    }

    //this.type = 'html';
    yield koaSend(this, `./${config.server.basePath}public/index.html`);
  });

  return app;
};
