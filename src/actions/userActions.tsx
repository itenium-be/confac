import request from 'superagent-bluebird-promise';
import {UserModel} from '../components/users/models/UserModel';
import {buildUrl} from './utils/buildUrl';
import {t} from '../components/utils';
import {catchHandler} from './utils/fetch';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';


export function saveUser(consultant: UserModel, callback?: (savedUser: UserModel) => void, history?: any) {
  return dispatch => {
    dispatch(busyToggle());
    return request
      .put(buildUrl('/user'))
      .set('Content-Type', 'application/json')
      .send(consultant)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.USER_UPDATE,
          user: response.body,
        });
        success(t('config.popupMessage'));
        if (history) {
          history.push('/users');
        }
        if (callback) {
          callback(response.body);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
