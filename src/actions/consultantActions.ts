import request from 'superagent-bluebird-promise';
import { buildUrl, catchHandler } from './utils/fetch';
import { ConsultantModel } from '../components/consultant/models/index';
import { busyToggle } from './appActions';


export function saveConsultant(consultant: ConsultantModel, stayOnPage = false, callback?: (consultant: ConsultantModel) => void) {
  return dispatch => {
    dispatch(busyToggle());
    return request.post(buildUrl('/consultants'))
      .set('Content-Type', 'application/json')
      .send(consultant)
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
