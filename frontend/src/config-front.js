if (process.env.NODE_ENV === 'production') {
  console.log('process.env', process.env);
  const baseUrl = window.location.origin;
  const backend = `${baseUrl}/api`;
  module.exports = {backend, baseUrl};
} else {
  const baseUrl = 'http://localhost:9000';
  module.exports = {backend: baseUrl + '/api',baseUrl};
}
