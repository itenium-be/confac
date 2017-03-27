const json = require('./config.json');
module.exports = Object.assign({env: process.env.NODE_ENV || 'dev'}, json);
