require('babel-polyfill');

var createApp = require('./server-init.js').createApp;
var config = require('./config.js');
var app = createApp(config);
app.listen(config.server.port);
