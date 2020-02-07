import {failure} from '../appActions';
import {store} from '../../store';
import {initialLoad} from '../initialLoad';
import t from '../../trans';

const urlPrefix = require('../../config-front').backend;

export function buildUrl(url: string): string {
  return urlPrefix + url;
}

export function catchHandler(err) {
  console.log('oepsie', err); // eslint-disable-line
  if (err.res.badRequest) {
    if (err.body) {
      console.error('BadRequest', err.body); // eslint-disable-line

      const msg = t(err.body.msg, err.body.data);
      failure(msg, 'BadRequest', 5000);

      if (err.body.reload) {
        store.dispatch(initialLoad());
      }

    } else {
      console.error('BadRequest', err.res.error); // eslint-disable-line
      failure('Unknown Erreur', 'BadRequest', 5000);
    }
    return;
  }
  failure();
}
