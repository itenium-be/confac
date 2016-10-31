import keyMirror from 'keymirror';
import request from 'superagent';

const urlPrefix = 'http://localhost:3001/api';

export const ACTION_TYPES = keyMirror({
  CONFIG_FETCHED: '',
  CLIENTS_FETCHED: '',
});

const httpGet = url => fetch('http://localhost:3001/api' + url).then(res => res.json());
// const httpGet = url => {
//   console.log('httpGet', url);
//   return request.get(urlPrefix + url)
//   .set('Accept', 'application/json')
//   .end(function(err, res) {
//     console.log('wuuk', url, res);
//     return JSON.parse(res.body);
//   });
// }

const httpPost = (url, body) => request.post(urlPrefix + url)
  .set('Content-Type', 'application/json')
  .send(body)
  .end(function(err, res) {
    //console.log('posted return', res.body);
    return res.body;
  });



export function initialLoad() {
  return dispatch => {
    console.log('dispatch initial load');
    dispatch(fetchClients());
    dispatch(fetchConfig());
  };
}

function fetchClients() {
 return (dispatch, state) => {
    return httpGet('/clients')
      .then(data => {
        dispatch({
          type: ACTION_TYPES.CLIENTS_FETCHED,
          clients: data
        });
      });
  };
}

function fetchConfig() {
  return (dispatch, state) => {
    return httpGet('/config')
      .then(data => {
        dispatch({
          type: ACTION_TYPES.CONFIG_FETCHED,
          config: data
        });
      });
  };
}

export function createInvoice(data) {
  console.log('datye', data);
  return dispatch => {
    return httpPost('/invoices/create', data);
  };
}