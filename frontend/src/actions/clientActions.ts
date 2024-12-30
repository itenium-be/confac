import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import t from '../trans';
import {ClientModel} from '../components/client/models/ClientModels';
import {busyToggle, success} from './appActions';
import {authService} from '../components/users/authService';
import { socketService } from '../components/socketio/SocketService';


export function saveClient(client: ClientModel, stayOnPage = false, callback?: (client: ClientModel) => void) {
  return dispatch => {
    dispatch(busyToggle());
    return request.post(buildUrl('/clients'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send(client)
      .then(res => {
        dispatch({
          type: ACTION_TYPES.CLIENT_UPDATE,
          client: res.body,
        });
        success(t('config.popupMessage'));
        if (!stayOnPage) {
          window.history.back();
        }
        if (callback) {
          callback(res.body);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
