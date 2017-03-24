console.log("yaye");
console.log("yaye", process.env);

if (process.env.REACT_APP_BACKEND_API_URL) {
  module.exports = {backend: process.env.REACT_APP_BACKEND_API_URL, environment: process.env.NODE_ENV || '???'};
} else {
  module.exports = {backend: 'http://localhost:3001/api', environment: process.env.NODE_ENV || 'dev'};
}
