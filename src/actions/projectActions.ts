import request from 'superagent-bluebird-promise';
import moment from 'moment';
import {Dispatch} from 'redux';
import {buildUrl, catchHandler} from './utils/fetch';
import t from '../trans';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {ProjectModel} from '../components/project/models/ProjectModel';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';

export function saveProject(project: ProjectModel, history: any) {
  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    return request
      .post(buildUrl('/projects'))
      .set('Content-Type', 'application/json')
      .send(project)
      .then(response => {
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

/** Create projectMonths for all active projects in the month */
export function createProjectsMonth(month: moment.Moment) {
  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    return request
      .post(buildUrl('/projects/month'))
      .set('Content-Type', 'application/json')
      .send({month})
      .then(response => {
        dispatch({
          type: ACTION_TYPES.PROJECTS_MONTH_FETCHED,
          projectsMonth: response.body,
        });
        success(t('config.popupMessage'));
      })
      .catch(catchHandler);
  };
}



export function patchProjectsMonth(project: ProjectMonthModel) {
  // ATTN: ProjectMonthFeatureBuilderConfig.save would expect this to be a put, not a patch!

  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    return request
      .patch(buildUrl('/projects/month'))
      .set('Content-Type', 'application/json')
      .send(project)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
          projectMonth: response.body,
        });
        success(t('config.popupMessage'));
        // history.push('/projects');
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}



export function projectMonthUpload(file: File, type: 'timesheet' | 'inbound') {
  console.log('projectMonthUpload', type, file);
  return {
    type: 'IMPLEMENT ME',
    payload: {},
  };
}
