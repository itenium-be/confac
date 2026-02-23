import {api} from './utils/api-client';
import {UserModel, RoleModel} from '../components/users/models/UserModel';
import {t} from '../components/utils';
import {catchHandler} from './utils/fetch';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {AppDispatch} from '../types/redux';


export function saveUser(user: UserModel, callback?: (savedUser: UserModel) => void, navigate?: (path: string) => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.put<UserModel>('/user', user);
      dispatch({
        type: ACTION_TYPES.USER_UPDATE,
        user: res.body,
      });
      success(t('config.popupMessage'));
      if (navigate) {
        navigate('/users');
      }
      if (callback) {
        callback(res.body);
      }
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
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
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.put<RoleModel>('/user/roles', role);
      dispatch({
        type: ACTION_TYPES.ROLE_UPDATE,
        role: res.body,
      });
      success(t('config.popupMessage'));
      if (navigate) {
        navigate('/users');
      }
      if (callback) {
        callback(res.body);
      }
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
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
