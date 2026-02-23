import {api} from './utils/api-client';
import {ACTION_TYPES} from './utils/ActionTypes';
import {catchHandler} from './utils/fetch';
import t from '../trans';
import {ConfigModel} from '../components/config/models/ConfigModel';
import {busyToggle, success} from './appActions';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {AppDispatch} from '../types/redux';

export function updateConfig(newConfig: ConfigModel) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.post<ConfigModel>('/config', newConfig);
      dispatch({type: ACTION_TYPES.CONFIG_UPDATE, config: res.body});
      success(t('config.popupMessage'));
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
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
