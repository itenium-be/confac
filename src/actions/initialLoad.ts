import {ACTION_TYPES} from './utils/ActionTypes';
import { buildUrl } from './utils/fetch';
import { failure } from './appActions';
import { toast } from 'react-toastify';

let counter: number;

const httpGet = (url: string) => fetch(buildUrl(url))
  .then(res => res.json(), err => {
    console.log('Initial Load Failure', err);
    if (counter === 0) {
      failure(err.message, 'Initial Load Failure', undefined, toast.POSITION.BOTTOM_RIGHT as any);
    }
    counter++;
    return Promise.reject(err);
  })
  .then(data => {
    if (data.message && data.stack) {
      console.log('Initial Load Failure', data);
      if (counter === 0) {
        failure(data.message, 'Initial Load Failure', undefined, toast.POSITION.BOTTOM_RIGHT as any);
      }
      counter++;
      return Promise.reject(data);
    }
    return data;
  });

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

export function initialLoad(): any {
  counter = 0;
  return dispatch => Promise.all([
    dispatch(fetchClients()),
    dispatch(fetchConfig()),
    dispatch(fetchInvoices()),
  ]).then(() => {
    dispatch({type: ACTION_TYPES.INITIAL_LOAD});
  });
}
