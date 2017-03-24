console.log('yaye');
console.log('yaye', process.env);

if (process.env.REACT_APP_DB_HOST) {
  module.exports = {
    db: {
      host: process.env.REACT_APP_DB_HOST,
      db: process.env.REACT_APP_DB_DB,
      port: process.env.REACT_APP_DB_PORT
    },
    server: {
      port: process.env.REACT_APP_SERVER_PORT,
      basePath: process.env.REACT_APP_SERVER_BASE_PATH
    },
    env: process.env.NODE_ENV || '???'
  };
} else {
  module.exports = {
    db: {
      host: 'localhost',
      db: 'confac-dev',
      port: 27018
    },
    server: {
      port: 3001,
      basePath: ''
    },
    env: process.env.NODE_ENV || 'dev'
  };
}
