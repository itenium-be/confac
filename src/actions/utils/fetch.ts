/* eslint-disable no-console */
import {failure} from '../appActions';
import {store} from '../../store';
import {initialLoad} from '../initialLoad';
import t from '../../trans';
import {authService} from '../../components/users/authService';

export function catchHandler(err) {
  console.log('oepsie', err);

  if (!err.res) {
    console.error('Erreur', err.message);
    failure(err.message);
    return;
  }

  if (err.res.badRequest) {
    if (err.body) {
      console.error('BadRequest', err.body);

      const msg = t(err.body.message, err.body.data);
      failure(msg, 'BadRequest', 5000);

      if (err.body.reload) {
        store.dispatch(initialLoad());
      }

    } else {
      console.error('BadRequest', err.res.error);
      failure('Unknown Erreur', 'BadRequest', 5000);
    }
    return;
  }

  if (err.res.unauthorized) {
    failure(err.body.message);
    setTimeout(() => {
      authService.logout();
      window.location.reload(false);
    }, 2000);
    return;
  }

  failure();
}
