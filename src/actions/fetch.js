import {failure} from './appActions.js';
import {store} from '../store.js';

const urlPrefix = require('../../config-front.js').backend;

export function buildUrl(url) {
  return urlPrefix + url;
}

export const httpGet = url => fetch(buildUrl(url)).then(res => res.json());

export function catchHandler(err) {
  if (err.res.badRequest) {
    console.log('BadRequest', err.body); // eslint-disable-line
    store.dispatch(failure('BadRequest', err.body.msg));
    return;
  }
  console.log('oepsie', err); // eslint-disable-line
  store.dispatch(failure());
}
