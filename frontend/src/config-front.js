console.log('process.env', process.env);

if (process.env.NODE_ENV === 'production') {
  const backend = `${window.location.origin}/api`;
  module.exports = {backend};
} else {
  module.exports = {backend: 'http://localhost:9000/api'};
}
