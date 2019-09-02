// console.log('ENV', process.env);

if (process.env.NODE_ENV === 'production') {
  const backend = window.location.origin + '/api';
  module.exports = {backend: backend};
} else {
  module.exports = {backend: 'http://localhost:9000/api'};
}
