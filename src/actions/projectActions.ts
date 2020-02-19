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



/** Create the invoice for a projectMonth */
export function createProjectsMonthInvoice(project: ProjectMonthModel) {
  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    return request
      .post(buildUrl(`/projects/month/${project._id}/create-invoice`))
      .set('Content-Type', 'application/json')
      // .send()
      .then(response => {
        dispatch({
          type: ACTION_TYPES.PROJECTS_MONTH_INVOICE_CREATED,
          projectsMonth: response.body.projectsMonth,
          invoice: response.body.invoice,
        });
        success(t('config.popupMessage'));
      })
      .catch(catchHandler);
  };
}



export function patchProjectsMonth(project: ProjectMonthModel) {
  // This is currently a put like all other saves
  // ATTN: ProjectMonthFeatureBuilderConfig.save would expect this to be a put, not a patch!


  // ATTN: BasicMathInput triggers onChange with user inputted text
  // And this is the "solution".
  const ts = project.timesheet;
  if (typeof ts.check === 'string' || typeof ts.timesheet === 'string') {
    return {type: 'NONE'};
  }


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



export function projectMonthUpload(file: File, type: 'timesheet' | 'inbound', projectMonthId: string) {
  return dispatch => {
    dispatch(busyToggle());
    const req = request.put(buildUrl(`/attachments/project_month/${projectMonthId}/${type}`));
    req.attach(file.name, file);
    req.then(response => {
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
        projectMonth: response.body,
      });
      success(t('config.popupMessage'));
      return true;
    })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}
