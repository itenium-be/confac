import {api} from './utils/api-client';
import {catchHandler} from './utils/fetch';
import t from '../trans';
import {ConsultantModel} from '../components/consultant/models/ConsultantModel';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {AppDispatch} from '../types/redux';

export function saveConsultant(
  consultant: ConsultantModel,
  callback?: (savedConsultant: ConsultantModel) => void,
  navigate?: (path: string) => void
) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.post<ConsultantModel>('/consultants', consultant);
      dispatch({
        type: ACTION_TYPES.CONSULTANT_UPDATE,
        consultant: res.body,
      });
      success(t('config.popupMessage'));
      if (navigate) {
        navigate('/consultants');
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
