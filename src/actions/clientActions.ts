import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {buildUrl, catchHandler} from './utils/fetch';
import t from '../trans';
import {ClientModel} from '../components/client/models/ClientModels';
import {busyToggle, success} from './appActions';


export function saveClient(client: ClientModel, stayOnPage = false, callback?: (client: ClientModel) => void) {
  return (dispatch) => {
    dispatch(busyToggle());
    return request.post(buildUrl('/clients'))
      .set('Content-Type', 'application/json')
      .send(client)
      .then((res) => {
        dispatch({
          type: ACTION_TYPES.CLIENT_UPDATE,
          client: res.body,
          isNewClient: !client._id,
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
