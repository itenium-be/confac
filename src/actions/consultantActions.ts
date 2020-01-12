import request from 'superagent-bluebird-promise';
import {buildUrl, catchHandler} from './utils/fetch';
import t from '../trans';
import {ConsultantModel} from '../components/consultant/models/index';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';


export function saveConsultant(consultant: ConsultantModel, stayOnPage = false, callback?: (consultant: ConsultantModel) => void) {
  return dispatch => {
    dispatch(busyToggle());
    return request.post(buildUrl('/consultants'))
      .set('Content-Type', 'application/json')
      .send(consultant)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.CONSULTANT_UPDATE,
          consultant: response.body,
        });
        success(t('config.popupMessage'));
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
