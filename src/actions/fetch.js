import {failure} from './appActions.js';
import {store} from '../store.js';

const urlPrefix = require('../../config-front.json').backend;

export function buildUrl(url) {
  return urlPrefix + url;
}

export const httpGet = url => fetch(buildUrl(url)).then(res => res.json());

export function catchHandler(err) {
  console.log('oepsie', err); // eslint-disable-line
  store.dispatch(failure(err));
}
