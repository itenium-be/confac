var config;
if (process.env.REACT_APP_DEPLOY) {
  switch (process.env.REACT_APP_DEPLOY) {
  case 'jos':
    config = {
      db: {
        host: 'localhost',
        db: 'confac',
        port: 32770
      },
      server: {
        port: 9000,
        basePath: 'dist/'
      },
      env: process.env.NODE_ENV || 'dev'
    };
    break;

  case 'pongit':
    config = {
      db: {
        host: 'localhost',
        db: 'confac',
        port: 32768
      },
      server: {
        port: 9000,
        basePath: ''
      },
      env: process.env.NODE_ENV || 'dev'
    };
    break;

  default:
    config = null;
  }
}

module.exports = config || {
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
