import request from 'superagent-bluebird-promise';
import {ACTION_TYPES} from './utils/ActionTypes';
import {buildUrl, catchHandler} from './utils/fetch';
import t from '../trans';
import {ConfigModel} from '../components/config/models/ConfigModel';
import {busyToggle, success} from './appActions';

export function updateConfig(newConfig: ConfigModel) {
  return dispatch => {
    dispatch(busyToggle());
    return request.post(buildUrl('/config'))
      .set('Content-Type', 'application/json')
      .send(newConfig)
      .then(res => {
        dispatch({type: ACTION_TYPES.CONFIG_UPDATE, config: res.body});
        success(t('config.popupMessage'));
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
