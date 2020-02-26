import {toast} from 'react-toastify';
import {Dispatch} from 'redux';
import {ACTION_TYPES} from './utils/ActionTypes';
import {buildUrl} from './utils/fetch';
import {failure} from './appActions';

let counter: number;

const httpGet = (url: string) => fetch(buildUrl(url))
  .then(
    res => res.json(),
    err => {
      console.log('Initial Load Failure', err);// eslint-disable-line
      if (counter === 0) {
        failure(err.message, 'Initial Load Failure', undefined, toast.POSITION.BOTTOM_RIGHT as any);
      }
      counter++;
      return Promise.reject(err);
    },
  )
  .then(data => {
    if (data.message && data.stack) {
      console.log('Initial Load Failure', data); // eslint-disable-line
      if (counter === 0) {
        failure(data.message, 'Initial Load Failure', undefined, toast.POSITION.BOTTOM_RIGHT as any);
      }
      counter++;
      return Promise.reject(data);
    }
    return data;
  });

function fetchClients() {
  return dispatch => httpGet('/clients').then(data => {
    dispatch({
      type: ACTION_TYPES.CLIENTS_FETCHED,
      clients: data,
    });
  });
}

function fetchConsultants() {
  return dispatch => httpGet('/consultants').then(data => {
    dispatch({
      type: ACTION_TYPES.CONSULTANTS_FETCHED,
      consultants: data,
    });
  });
}

function fetchProjects() {
  return dispatch => httpGet('/projects').then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_FETCHED,
      projects: data,
    });
  });
}

function fetchConfig() {
  return dispatch => httpGet('/config').then(data => {
    dispatch({
      type: ACTION_TYPES.CONFIG_FETCHED,
      config: data,
    });
  });
}

function fetchInvoices() {
  return dispatch => httpGet('/invoices').then(data => {
    dispatch({
      type: ACTION_TYPES.INVOICES_FETCHED,
      invoices: data,
    });
  });
}

function fetchProjectsMonth() {
  return dispatch => httpGet('/projects/month').then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_FETCHED,
      projectsMonth: data,
    });
  });
}

function fetchProjectsMonthOverviews() {
  return (dispatch: Dispatch) => httpGet('/projects/month/overview').then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_FETCHED,
      projectsMonthOverviews: data,
    });
  });
}

export function initialLoad(): any {
  counter = 0;
  return dispatch => Promise.all([
    dispatch(fetchClients()),
    dispatch(fetchConfig()),
    dispatch(fetchInvoices()),
    dispatch(fetchConsultants()),
    dispatch(fetchProjects()),
    dispatch(fetchProjectsMonth()),
    dispatch(fetchProjectsMonthOverviews()),
  ]).then(() => {
    dispatch({type: ACTION_TYPES.INITIAL_LOAD});
  });
}
