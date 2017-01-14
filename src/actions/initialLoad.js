import {ACTION_TYPES } from './ActionTypes.js';
import {httpGet } from './fetch';

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
  return dispatch => Promise.all([
    dispatch(fetchClients()),
    dispatch(fetchConfig()),
    dispatch(fetchInvoices()),
  ]).then(() => {
    dispatch({type: ACTION_TYPES.INITIAL_LOAD});
  });
}
