//import request from 'superagent';

const urlPrefix = 'http://localhost:3001/api'; // TODO: put this in some environment config

export function buildUrl(url) {
  return urlPrefix + url;
}

export const httpGet = url => fetch(urlPrefix + url).then(res => res.json());

// const httpGet = url => {
//   console.log('httpGet', url);
//   return request.get(urlPrefix + url)
//   .set('Accept', 'application/json')
//   .end(function(err, res) {
//     console.log('wuuk', url, res);
//     return JSON.parse(res.body);
//   });
// }

// const httpPost = (url, body) => request.post(urlPrefix + url)
//   .set('Content-Type', 'application/json')
//   .send(body)
//   .end(function(err, res) {
//     console.log('posted return', res);
//     return res.body;
//   });
