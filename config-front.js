function getBackend() {
  // Port 9000 is hardcoded in backend/config-xxx.json
  switch (process.env.REACT_APP_DEPLOY) {
  case 'jos':
    return 'http://localhost:9000/api';
  case 'pongit':
    return 'http://localhost:9000/api';
  default:
    return 'oepsie!';
  }
}

if (process.env.REACT_APP_DEPLOY) {
  const backend = getBackend();
  module.exports = {backend: backend, environment: process.env.NODE_ENV || '???'};
} else {
  module.exports = {backend: 'http://localhost:3001/api', environment: process.env.NODE_ENV || 'dev'};
}
