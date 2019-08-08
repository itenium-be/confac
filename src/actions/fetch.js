import {failure} from './appActions.js';
import {store} from '../store.js';
import {initialLoad} from './initialLoad.js';
import t from '../trans.js';

const urlPrefix = require('../../config-front.js').backend;

export function buildUrl(url) {
  return urlPrefix + url;
}

export const httpGet = url => fetch(buildUrl(url)).then(res => res.json());

export function catchHandler(err) {
  if (err.res.badRequest) {
    console.log('BadRequest', err.body); // eslint-disable-line

    const msg = t(err.body.msg, err.body.data);
    store.dispatch(failure('BadRequest', msg, 8000));

    if (err.body.reload) {
      store.dispatch(initialLoad());
    }
    return;
  }
  console.log('oepsie', err); // eslint-disable-line
  store.dispatch(failure());
}
