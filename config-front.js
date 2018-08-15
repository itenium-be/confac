console.log('config', process.env);

if (process.env.REACT_APP_DEPLOY) {
  // Could just use: process.env.PUBLIC provided by react-create-app?
  const backend = window.location.origin + '/api';
  module.exports = {backend: backend, environment: process.env.REACT_APP_ENV || '???'};
} else {
  module.exports = {backend: 'http://localhost:3001/api', environment: 'localhost-dev'};
}
