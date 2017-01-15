require('babel-polyfill');

var createApp = require('./server-init.js').createApp;
var config = require('./config.json');
var app = createApp(config);
app.listen(config.server.port);
