require('babel-polyfill');

var createApp = require('./server-init.js').createApp;

var json = require('./config.json');
if (process.env.SERVER_HOST) {
  json = {
    db: {
      host: process.env.MONGO_HOST || json.db.host,
      db: process.env.MONGO_DB || json.db.db,
      port: process.env.MONGO_PORT || json.db.port,
    },
    server: {
      port: process.env.SERVER_PORT || json.server.port,
      basePath: process.env.SERVER_BASEPATH || json.server.basePath,
    }
  };
}

var config = Object.assign({env: process.env.NODE_ENV || 'dev'}, json);

var app = createApp(config);
console.log('Starting at ' + config.server.port);
console.log('Config', JSON.stringify(config));
app.listen(config.server.port, () => console.log('Started!'));
