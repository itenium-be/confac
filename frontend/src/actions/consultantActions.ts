import request from 'superagent-bluebird-promise';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import t from '../trans';
import {ConsultantModel} from '../components/consultant/models/ConsultantModel';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {authService} from '../components/users/authService';
import {socketService} from '../components/socketio/SocketService';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {AppDispatch} from '../types/redux';

export function saveConsultant(
  consultant: ConsultantModel,
  callback?: (savedConsultant: ConsultantModel) => void,
  navigate?: (path: string) => void
) {
  return (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    return request
      .post(buildUrl('/consultants'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send(consultant)
      .then((response) => {
        dispatch({
          type: ACTION_TYPES.CONSULTANT_UPDATE,
          consultant: response.body,
        });
        success(t('config.popupMessage'));
        if (navigate) {
          navigate('/consultants');
        }
        if (callback) {
          callback(response.body);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export function handleConsultantSocketEvents(
  eventType: SocketEventTypes,
  eventPayload: EntityEventPayload
) {
  return (dispatch: AppDispatch) => {
    switch (eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        dispatch({
          type: ACTION_TYPES.CONSULTANT_UPDATE,
          consultant: eventPayload.entity,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for consultant.`);
    }
  };
}
