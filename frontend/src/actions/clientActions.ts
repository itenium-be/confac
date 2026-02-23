import {api} from './utils/api-client';
import {ACTION_TYPES} from './utils/ActionTypes';
import {catchHandler} from './utils/fetch';
import t from '../trans';
import {ClientModel} from '../components/client/models/ClientModels';
import {busyToggle, success} from './appActions';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {AppDispatch} from '../types/redux';


export function saveClient(client: ClientModel, stayOnPage = false, callback?: (c: ClientModel) => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.post<ClientModel>('/clients', client);
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
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

export function handleClientSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: AppDispatch) => {
    switch (eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        dispatch({
          type: ACTION_TYPES.CLIENT_UPDATE,
          client: eventPayload.entity,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for client.`);
    }
  };
}

export function syncClientPeppolStatus(clientId: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const res = await api.post<ClientModel & {message?: string}>(`/clients/${clientId}/peppol/sync`);
      if (res.body.message) {
        return;
      }
      dispatch({
        type: ACTION_TYPES.CLIENT_UPDATE,
        client: res.body,
      });
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}
