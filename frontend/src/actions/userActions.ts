import request from 'superagent-bluebird-promise';
import {authService} from '../components/users/authService';
import {UserModel, RoleModel} from '../components/users/models/UserModel';
import {buildUrl} from './utils/buildUrl';
import {t} from '../components/utils';
import {catchHandler} from './utils/fetch';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {socketService} from '../components/socketio/SocketService';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {AppDispatch} from '../types/redux';


export function saveUser(user: UserModel, callback?: (savedUser: UserModel) => void, navigate?: (path: string) => void) {
  return (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    return request
      .put(buildUrl('/user'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send(user)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.USER_UPDATE,
          user: response.body,
        });
        success(t('config.popupMessage'));
        if (navigate) {
          navigate('/users');
        }
        if (callback) {
          callback(response.body);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export function handleUserSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: AppDispatch) => {
    switch (eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        dispatch({
          type: ACTION_TYPES.USER_UPDATE,
          user: eventPayload.entity,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for user.`);
    }
  };
}


export function saveRole(role: RoleModel, callback?: (savedRole: RoleModel) => void, navigate?: (path: string) => void) {
  return (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    return request
      .put(buildUrl('/user/roles'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send(role)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.ROLE_UPDATE,
          role: response.body,
        });
        success(t('config.popupMessage'));
        if (navigate) {
          navigate('/users');
        }
        if (callback) {
          callback(response.body);
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export function handleRoleSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: AppDispatch) => {
    switch (eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        dispatch({
          type: ACTION_TYPES.ROLE_UPDATE,
          role: eventPayload.entity,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for role.`);
    }
  };
}
