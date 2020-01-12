import request from 'superagent-bluebird-promise';
import {Dispatch} from 'redux';
import {buildUrl, catchHandler} from './utils/fetch';
import t from '../trans';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {ProjectModel, ProjectMonthModel} from '../components/project/models';

export function saveProject(project: ProjectModel, history: any) {
  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    return request
      .post(buildUrl('/projects'))
      .set('Content-Type', 'application/json')
      .send(project)
      .then((response) => {
        dispatch({
          type: ACTION_TYPES.PROJECT_UPDATE,
          project: response.body,
        });
        success(t('config.popupMessage'));
        history.push('/projects');
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export function saveProjectMonth(projectMonth: ProjectMonthModel) {
  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    return request
      .post(buildUrl('/projects/month'))
      .set('Content-Type', 'application/json')
      .send(projectMonth)
      .then((response) => {
        success(t('config.popupMessage'));
      })
      .catch(catchHandler);
  };
}
