import request from 'superagent';
import { ACTION_TYPES } from './ActionTypes.js';
import { httpGet, buildUrl } from './fetch';

export * from './invoiceActions.js';

function fetchClients() {
  return dispatch => {
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
  return dispatch => {
    return httpGet('/config')
      .then(data => {
        dispatch({
          type: ACTION_TYPES.CONFIG_FETCHED,
          config: data
        });
      });
  };
}

function fetchInvoices() {
  return dispatch => {
    return httpGet('/invoices')
      .then(data => {
        dispatch({
          type: ACTION_TYPES.INVOICES_FETCHED,
          invoices: data
        });
      });
  };
}

export function initialLoad() {
  return dispatch => {
    dispatch(fetchClients());
    dispatch(fetchConfig());
    dispatch(fetchInvoices());
  };
}

export function updateConfig(newConfig) {
  return () => {
    return request.post(buildUrl('/config'))
      .set('Content-Type', 'application/json')
      .send(newConfig)
      .end(() => {});
  };
}
