/* eslint-disable no-console */
import {toast} from 'react-toastify';
import {Dispatch} from 'redux';
import {authService} from '../components/users/authService';
import {ACTION_TYPES} from './utils/ActionTypes';
import {buildUrl} from './utils/buildUrl';
import {failure} from './appActions';
import {getProjectMonthsFilters} from '../reducers/app-state';
import {Features} from '../components/controls/feature/feature-models';

let counter: number;


export const buildRequest = (url: string) => {
  const headers = new Headers();
  // headers.append('Accept-Language', defaultLocale);
  if (authService.loggedIn()) {
    headers.append('Authorization', authService.getBearer());
  }
  const request = new Request(buildUrl(url), {
    method: 'GET',
    headers,
    // mode: 'cors',
    // cache: 'default',
  });
  return request;
};


const httpGet = (url: string) => {
  const request = buildRequest(url);
  return fetch(request)
    .then(res => {
      if (url === '/config' && res.status === 404) {
        // First run: Stick to frontend config defaults
        return null;
      }

      if (res.ok) {
        return res.json();
      }

      console.log('Initial Load No Success Status', res);
      return res.json().then(data => {
        if (res.status === 401 && data.message === 'invalid_token') {
          authService.logout();
          window.location.reload();
        }
        return data;
      });
    })
    .catch(err => {
      console.log('Initial Load Failure', err);
      if (counter === 0) {
        failure(err.message, 'Initial Load Failure', undefined, toast.POSITION.BOTTOM_RIGHT as any);
      }
      counter++;
      return Promise.reject(err);
    })
    .then(data => {
      if (url === '/config' && data === null) {
        // First run: Stick to frontend config defaults
        return null;
      }

      if (data.message) {
        console.log('Initial Load Failure', data);
        if (counter === 0) {
          failure(data.message, 'Initial Load Failure', undefined, toast.POSITION.BOTTOM_RIGHT as any);
        }
        counter++;
        return Promise.reject(data);
      }
      return data;
    });
};

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

function fetchProjects(initialMonthsLoad: number) {
  const url = '/projects?months=' + initialMonthsLoad;
  return dispatch => httpGet(url).then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_FETCHED,
      projects: data,
    });
  });
}


function fetchInvoices(initialMonthsLoad: number) {
  const url = '/invoices?months=' + initialMonthsLoad;
  return dispatch => httpGet(url).then(data => {
    dispatch({
      type: ACTION_TYPES.INVOICES_FETCHED,
      invoices: data,
    });
  });
}

function fetchUsers() {
  return dispatch => httpGet('/user').then(data => {
    dispatch({
      type: ACTION_TYPES.USERS_FETCHED,
      users: data,
    });
  });
}

function fetchRoles() {
  return dispatch => httpGet('/user/roles').then(data => {
    dispatch({
      type: ACTION_TYPES.ROLES_FETCHED,
      roles: data,
    });
  });
}

function fetchProjectsMonth(initialMonthsLoad: number) {
  const url = '/projects/month?months=' + initialMonthsLoad;
  return dispatch => httpGet(url).then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_FETCHED,
      projectsMonth: data,
    });

    if (data.length) {
      dispatch({
        type: ACTION_TYPES.APP_FILTERUPDATED,
        payload: {
          feature: Features.projectMonths,
          filters: getProjectMonthsFilters(data),
        },
      });
    }
  });
}

function fetchProjectsMonthOverviews(initialMonthsLoad: number) {
  const url = '/projects/month/overview?months=' + initialMonthsLoad;
  return (dispatch: Dispatch) => httpGet(url).then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_FETCHED,
      projectsMonthOverviews: data,
    });
  });
}

export function initialLoad(loadNextMonth?: number): any {
  if (!authService.loggedIn()) {
    return {type: 'NONE'};
  }

  return dispatch => {
    console.log('initial load STARTED!!');

    counter = 0;

    let monthsToLoad: number = loadNextMonth!;
    let promise: any = httpGet('/config').then(data => {
      dispatch({
        type: ACTION_TYPES.CONFIG_FETCHED,
        config: data,
      });
      if (!loadNextMonth) {
        monthsToLoad = data.initialMonthLoad;
      }
    });

    promise = promise.then(() => [
      dispatch(fetchClients()),
      dispatch(fetchConsultants()),
      dispatch(fetchUsers()),
      dispatch(fetchRoles()),
      dispatch(fetchInvoices(monthsToLoad)),
      dispatch(fetchProjects(monthsToLoad)),
      dispatch(fetchProjectsMonth(monthsToLoad)),
      dispatch(fetchProjectsMonthOverviews(monthsToLoad)),
    ]);

    return promise
      .then(() => dispatch({type: ACTION_TYPES.INITIAL_LOAD, lastMonthsDownloaded: monthsToLoad}));
  }
}
