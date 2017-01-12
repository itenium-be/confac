import koa from 'koa';
import koaCors from 'kcors';
import koaBodyParser from 'koa-bodyparser';
import koaServe from 'koa-static';
import koaMongo from 'koa-mongo';

const ObjectId = require('mongodb').ObjectId;
String.prototype.toObjectId = function(key = '_id') {
  return {[key]: new ObjectId(this)};
};

export const createApp = () => {
  const app = koa();

  // var delay = require('koa-delay');
  // app.use(delay(1000, 20));

  app.use(koaCors());
  app.use(koaBodyParser());
  app.use(koaServe('./templates/'));

  const db = require('./config.json').db;
  app.use(koaMongo({
    uri: `mongodb://${db.host}:${db.port}/${db.db}`,
    max: 100,
    min: 1,
    timeout: 30000,
    log: false
  }));

  require('./resources/config.js').default(app);
  require('./resources/clients.js').default(app);
  require('./resources/invoices.js').default(app);
  require('./resources/attachments.js').default(app);

  return app;
};
