import { ACTION_TYPES } from './ActionTypes.js';
import { httpGet } from './fetch';

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

export function initialLoad() {
  return dispatch => {
    dispatch(fetchClients());
    dispatch(fetchConfig());
  };
}
