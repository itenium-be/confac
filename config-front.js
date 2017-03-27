function getBackend() {
  switch (process.env.REACT_APP_DEPLOY) {
  case 'jos':
    return 'http://192.168.1.4:9000/api';
  case 'pongit':
    return 'http://synology-pongit:9000/api';
  default
    return 'oepsie!';
  }
}

if (process.env.REACT_APP_DEPLOY) {
  const backend = getBackend();
  module.exports = {backend: backend, environment: process.env.NODE_ENV || '???'};
} else {
  module.exports = {backend: 'http://localhost:3001/api', environment: process.env.NODE_ENV || 'dev'};
}
