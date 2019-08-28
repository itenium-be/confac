import {failure} from './appActions';
import {store} from '../store';
import {initialLoad} from './initialLoad';
import t from '../trans';

const urlPrefix = require('../config-front').backend;

export function buildUrl(url: string): string {
  return urlPrefix + url;
}

export const httpGet = url => fetch(buildUrl(url)).then(res => res.json());

export function catchHandler(err) {
  console.log('oepsie', err); // eslint-disable-line
  if (err.res.badRequest) {
    console.log('BadRequest', err.body); // eslint-disable-line

    const msg = t(err.body.msg, err.body.data);
    failure(msg, 'BadRequest', 5000);

    if (err.body.reload) {
      store.dispatch(initialLoad());
    }
    return;
  }
  failure();
}
