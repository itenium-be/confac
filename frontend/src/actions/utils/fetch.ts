
import {failure} from '../appActions';
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
      console.error('BadRequest', msg);
      failure(msg, 'BadRequest', false);

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
      window.location.reload();
    }, 2000);
    return;
  }

  if (err.status === 500) {
    if (err.body) {
      console.error('InternalServerError', err.body.message);
      failure(err.body.message, 'InternalServerError', 5000);
      console.error('Stack Trace', err.body.stack?.replace(/↵/g, '\n'));

    } else {
      console.error('InternalServerError', err.res.error);
      failure('Unknown Erreur', 'InternalServerError', 5000);
    }
    return;
  }

  failure();
}
