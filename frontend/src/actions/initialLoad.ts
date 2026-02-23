
import {authService} from '../components/users/authService';
import {ACTION_TYPES} from './utils/ActionTypes';
import {buildUrl} from './utils/buildUrl';
import {failure} from './appActions';
import {getProjectMonthsFilters} from '../reducers/app-state';
import {Features} from '../components/controls/feature/feature-models';
import {socketService} from '../components/socketio/SocketService';
import {AppDispatch, AppThunkAction} from '../types/redux';
import {ConfigModel} from '../components/config/models/ConfigModel';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';

let counter: number;


export const buildRequest = (url: string) => {
  const headers = new Headers();
  // headers.append('Accept-Language', defaultLocale);
  if (authService.loggedIn()) {
    headers.append('Authorization', authService.getBearer());
  }
  if (socketService.socketId) {
    headers.append('x-socket-id', socketService.socketId);
  }
  const request = new Request(buildUrl(url), {
    method: 'GET',
    headers,
    // mode: 'cors',
    // cache: 'default',
  });
  return request;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpGet = <T = any>(url: string): Promise<T> => {
  const request = buildRequest(url);
  return fetch(request)
    .then(res => {
      if (url === '/config' && res.status === 404) {
        // First run: Stick to frontend config defaults
        return null as T;
      }

      if (res.ok) {
        return res.json() as Promise<T>;
      }

      console.log('Initial Load No Success Status', res);
      return res.json().then((data: {message?: string}) => {
        if (res.status === 401 && data.message === 'invalid_token') {
          authService.logout();
          window.location.reload();
        }
        return data as T;
      });
    })
    .catch((err: Error) => {
      console.log('Initial Load Failure', err);
      if (counter === 0) {
        failure(err.message, 'Initial Load Failure', undefined, 'bottom-right');
      }
      counter++;
      return Promise.reject(err);
    })
    .then((data: T) => {
      if (url === '/config' && data === null) {
        // First run: Stick to frontend config defaults
        return null as T;
      }

      if (data && typeof data === 'object' && 'message' in data && (data as {message?: string}).message) {
        console.log('Initial Load Failure', data);
        if (counter === 0) {
          failure((data as {message: string}).message, 'Initial Load Failure', undefined, 'bottom-right');
        }
        counter++;
        return Promise.reject(data);
      }
      return data;
    });
};

function fetchClients() {
  return (dispatch: AppDispatch) => httpGet('/clients').then(data => {
    dispatch({
      type: ACTION_TYPES.CLIENTS_FETCHED,
      clients: data,
    });
  });
}

function fetchConsultants() {
  return (dispatch: AppDispatch) => httpGet('/consultants').then(data => {
    dispatch({
      type: ACTION_TYPES.CONSULTANTS_FETCHED,
      consultants: data,
    });
  });
}

function fetchProjects(initialMonthsLoad: number) {
  const url = '/projects?months=' + initialMonthsLoad;
  return (dispatch: AppDispatch) => httpGet(url).then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_FETCHED,
      projects: data,
    });
  });
}


function fetchInvoices(initialMonthsLoad: number) {
  const url = '/invoices?months=' + initialMonthsLoad;
  return (dispatch: AppDispatch) => httpGet(url).then(data => {
    dispatch({
      type: ACTION_TYPES.INVOICES_FETCHED,
      invoices: data,
    });
  });
}

function fetchUsers() {
  return (dispatch: AppDispatch) => httpGet('/user').then(data => {
    dispatch({
      type: ACTION_TYPES.USERS_FETCHED,
      users: data,
    });
  });
}

function fetchRoles() {
  return (dispatch: AppDispatch) => httpGet('/user/roles').then(data => {
    dispatch({
      type: ACTION_TYPES.ROLES_FETCHED,
      roles: data,
    });
  });
}

function fetchProjectsMonth(initialMonthsLoad: number) {
  const url = '/projects/month?months=' + initialMonthsLoad;
  return (dispatch: AppDispatch) => httpGet<ProjectMonthModel[]>(url).then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_FETCHED,
      projectsMonth: data,
    });

    if (data && data.length) {
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
  return (dispatch: AppDispatch) => httpGet(url).then(data => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_FETCHED,
      projectsMonthOverviews: data,
    });
  });
}

export function initialLoad(loadNextMonth?: number): {type: string} | AppThunkAction<Promise<void>> {
  if (!authService.loggedIn()) {
    return {type: 'NONE'};
  }

  return (dispatch: AppDispatch) => {
    console.log('initial load STARTED!!');

    counter = 0;

    let monthsToLoad: number = loadNextMonth!;
    const promise = httpGet<ConfigModel | null>('/config').then(data => {
      if (data === null) {
        console.log('First login, starting with defaultConfig');
        if (!loadNextMonth) {
          monthsToLoad = 18;
        }

      } else {
        dispatch({
          type: ACTION_TYPES.CONFIG_FETCHED,
          config: data,
        });
        if (!loadNextMonth) {
          monthsToLoad = data.initialMonthLoad;
        }
      }
    });

    return promise.then(() => {
      return Promise.all([
        dispatch(fetchClients()),
        dispatch(fetchConsultants()),
        dispatch(fetchUsers()),
        dispatch(fetchRoles()),
        dispatch(fetchInvoices(monthsToLoad)),
        dispatch(fetchProjects(monthsToLoad)),
        dispatch(fetchProjectsMonth(monthsToLoad)),
        dispatch(fetchProjectsMonthOverviews(monthsToLoad)),
      ]);
    }).then(() => {
      dispatch({type: ACTION_TYPES.INITIAL_LOAD, lastMonthsDownloaded: monthsToLoad});
    });
  };
}
