import {failure} from './appActions.js';
import {store} from '../store.js';

const urlPrefix = require('../../config-front.js').backend;

export function buildUrl(url) {
  return urlPrefix + url;
}

export const httpGet = url => fetch(buildUrl(url)).then(res => res.json());
//add auth bearer token to every request except for auth endpoint.
//Could this be done DRY?

export function catchHandler(err) {
  console.log('oepsie', err); // eslint-disable-line
  store.dispatch(failure());
}
