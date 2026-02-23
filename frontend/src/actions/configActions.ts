import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import t from '../trans';
import {ConfigModel} from '../components/config/models/ConfigModel';
import {busyToggle, success} from './appActions';
import {authService} from '../components/users/authService';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {socketService} from '../components/socketio/SocketService';
import {AppDispatch} from '../types/redux';

export function updateConfig(newConfig: ConfigModel) {
  return (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    return request.post(buildUrl('/config'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send(newConfig)
      .then(res => {
        dispatch({type: ACTION_TYPES.CONFIG_UPDATE, config: res.body});
        success(t('config.popupMessage'));
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export function handleConfigSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: AppDispatch) => {
    switch (eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        dispatch({
          type: ACTION_TYPES.CONFIG_UPDATE,
          config: eventPayload.entity,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for config.`);
    }
  };
}
