function getBackend() {
  // Port 9000 is hardcoded in backend/config-xxx.json
  // Could just use: process.env.PUBLIC provided by react-create-app?
  switch (process.env.REACT_APP_DEPLOY) {
  case 'jos':
    return `http://${process.env.PUBLIC_URL}:9000/api`;
  case 'pongit':
    return `http://${process.env.PUBLIC_URL}:9000/api`;
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
