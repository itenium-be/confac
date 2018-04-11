require('babel-polyfill');

var createApp = require('./server-init.js').createApp;
var config = require('./config.js');
var app = createApp(config);
console.log('Starting at ' + config.server.port);
console.log('Config', JSON.stringify(config));
app.listen(config.server.port, () => console.log('Started!'));
