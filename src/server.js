require('babel-polyfill');

var createApp = require('./server-init.js').createApp;

// console.log('process.env', JSON.stringify(process.env));

var json = require('./config.json');
if (process.env) {
  json = {
    db: {
      host: process.env.MONGO_HOST || json.db.host,
      db: process.env.MONGO_DB || json.db.db,
      port: process.env.MONGO_PORT || json.db.port,
    },
    server: {
      host: process.env.SERVER_HOST || json.server.host,
      port: process.env.SERVER_PORT || json.server.port,
      basePath: process.env.SERVER_BASEPATH || json.server.basePath,
    }
  };
}

var config = Object.assign({env: process.env.NODE_ENV || 'dev'}, json);

var app = createApp(config);
console.log('Starting at ' + config.server.port + ' on ' + new Date().toString());
console.log('Config', JSON.stringify(config));
app.listen(config.server.port, () => console.log('Started!'));
