import request from 'superagent-bluebird-promise';
import {Moment} from 'moment';
import {Dispatch} from 'redux';
import {catchHandler} from './utils/fetch';
import {buildUrl} from './utils/buildUrl';
import t from '../trans';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {IProjectModel} from '../components/project/models/IProjectModel';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';
import {TimesheetCheckAttachmentType} from '../models';
import {authService} from '../components/users/authService';
import {FullProjectMonthModel} from '../components/project/models/FullProjectMonthModel';
import { socketService } from '../components/socketio/SocketService';
import { EntityEventPayload } from '../components/socketio/EntityEventPayload';
import { SocketEventTypes } from '../components/socketio/SocketEventTypes';
import { store } from '../store';
import moment from 'moment';

export function saveProject(project: IProjectModel, navigate?: any, after: 'to-list' | 'to-details' = 'to-list') {
  return (dispatch: Dispatch) => {
    dispatch(busyToggle());
    return request
      .post(buildUrl('/projects'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send(project)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.PROJECT_UPDATE,
          project: response.body,
        });
        success(t('config.popupMessage'));
        if (navigate) {
          if (after === 'to-list') {
            navigate('/projects');
          } else {
            navigate(`/projects/${response.body._id}`);
          }
        }
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}

export type sourceProjectData = {
  projectId: string,
  hasProforma?: boolean
}


/** Create projectMonths for all active projects in the month */
export function createProjectsMonth(month: Moment, projectData: sourceProjectData[]) {
  return (dispatch: Dispatch) => request
    .post(buildUrl('/projects/month'))
    .set('Content-Type', 'application/json')
    .set('Authorization', authService.getBearer())
    .set('x-socket-id', socketService.socketId)
    .send({month, projectData})
    .then(response => {
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_FETCHED,
        projectsMonth: response.body,
      });
      success(t('config.popupMessage'));
    })
    .catch(catchHandler);
}



/** Create the invoice for a projectMonth */
export function createProjectsMonthInvoice(project: ProjectMonthModel) {
  return (dispatch: Dispatch) => request
    .post(buildUrl(`/projects/month/${project._id}/create-invoice`))
    .set('Content-Type', 'application/json')
    .set('Authorization', authService.getBearer())
    .set('x-socket-id', socketService.socketId)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_INVOICE_CREATED,
        projectsMonth: response.body.projectsMonth,
        invoice: response.body.invoice,
      });
      success(t('config.popupMessage'));
    })
    .catch(catchHandler);
}




export function deleteProjectsMonth(id: string, navigate: any) {
  return dispatch => {
    dispatch(busyToggle());
    request.delete(buildUrl('/projects/month'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send({id})
      .then(res => {
        console.log('projectMonth deleted', id); // eslint-disable-line
        dispatch({
          type: ACTION_TYPES.PROJECTS_MONTH_DELETE,
          id,
        });
        success(t('projectMonth.deleteConfirm.toastr'));
        navigate('/projects');
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
  };
}



export function deleteProject(id: string, navigate: any) {
  return dispatch => {
    dispatch(busyToggle());
    request.delete(buildUrl('/projects'))
      .set('Content-Type', 'application/json')
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      .send({id})
      .then(res => {
        console.log('project deleted', id); // eslint-disable-line
        dispatch({
          type: ACTION_TYPES.PROJECT_DELETE,
          id,
        });
        success(t('project.deleteConfirm.toastr'));
        navigate('/projects');
        return true;
      })
      .catch(catchHandler)
      .then(() => dispatch(busyToggle.off()));
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


  return (dispatch: Dispatch) => request
    .patch(buildUrl('/projects/month'))
    .set('Content-Type', 'application/json')
    .set('Authorization', authService.getBearer())
    .set('x-socket-id', socketService.socketId)
    .send(project)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
        projectMonth: response.body,
      });
      success(t("config.popupMessage"));
      // navigate('/projects');
    })
    .catch(catchHandler);
}

type ProjectMonthAttachmentTypes = 'Getekende timesheet' | 'Factuur freelancer' | 'Proforma Factuur';

export function projectMonthUpload(file: File, type: ProjectMonthAttachmentTypes, projectMonth: FullProjectMonthModel, fileName: string) {
  return (dispatch: Dispatch) => {
    const modelType = projectMonth.invoice ? 'invoice' : 'project_month';
    const modelId = projectMonth.invoice ? projectMonth.invoice._id : projectMonth._id;
    const req = request
      .put(buildUrl(`/attachments/${modelType}/${modelId}/${type}`))
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      ;

    req.attach(fileName, file);
    req.then(response => {
      if (projectMonth.invoice) {
        dispatch({
          type: ACTION_TYPES.INVOICE_UPDATED,
          invoice: response.body,
        });
      } else {
        dispatch({
          type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
          projectMonth: response.body,
        });
      }
      success(t('config.popupMessage'));
      return true;
    })
      .catch(catchHandler);
  };
}

export function projectsMonthOverviewUpload(file: File, month: Moment) {
  return (dispatch: Dispatch) => {
    const req = request
      .put(buildUrl(`/attachments/project_month_overview/${month.toISOString()}/${TimesheetCheckAttachmentType}`))
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId);

    req.attach(file.name, file);
    req.then(response => {
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_UPDATE,
        projectsMonthOverview: response.body,
      });
      success(t('config.popupMessage'));
      return true;
    })
      .catch(catchHandler);
  };
}

export function deleteProjectsMonthOverview(id: string) {
  return (dispatch: Dispatch) => {
    const req = request
      .delete(buildUrl(`/attachments/project_month_overview/${id}/${TimesheetCheckAttachmentType}`))
      .set('Authorization', authService.getBearer())
      .set('x-socket-id', socketService.socketId)
      ;

    req.then(response => {
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_DELETE,
        projectsMonthOverviewId: id,
      });
      success(t('config.popupMessage'));
      return true;
    })
      .catch(catchHandler);
  };
}

export function deleteProjectMonthAttachmentDetails(projectMonth: ProjectMonthModel) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
      projectMonth: {...projectMonth, attachments: []},
    });
  };
}

export function handleProjectSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: Dispatch) => {
    switch(eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        dispatch({
          type: ACTION_TYPES.PROJECT_UPDATE,
          project: eventPayload.entity,
        });
        break;
      case SocketEventTypes.EntityDeleted:
        dispatch({
          type: ACTION_TYPES.PROJECT_DELETE,
          id: eventPayload.entityId,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for project.`);
    }
  }
}

export function handleProjectMonthSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: Dispatch) => {
    switch(eventType) {
      case SocketEventTypes.EntityUpdated:
      case SocketEventTypes.EntityCreated:
        if (Array.isArray(eventPayload.entity)) {
          dispatch({
            type: ACTION_TYPES.PROJECTS_MONTH_FETCHED,
            projectsMonth: eventPayload.entity,
          });
        } else {
          dispatch({
            type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
            projectMonth: eventPayload.entity,
          });

          // HACK: Open/Close the month so that it is refreshed
          const storeState = store.getState();
          const projectMonth = eventPayload.entity as ProjectMonthModel;
          const monthKey = moment(projectMonth.month).format('YYYY-MM');
          if (storeState.app.filters.projectMonths.openMonths[monthKey]) {
            dispatch({
              type: ACTION_TYPES.APP_FILTER_OPEN_MONTHS_UPDATED,
              payload: {
                month: monthKey,
                opened: false,
              },
            });

            setTimeout(() => {
              dispatch({
                type: ACTION_TYPES.APP_FILTER_OPEN_MONTHS_UPDATED,
                payload: {
                  month: monthKey,
                  opened: true,
                },
              });
            });
          }
        }
        break;
      case SocketEventTypes.EntityDeleted:
        dispatch({
          type: ACTION_TYPES.PROJECTS_MONTH_DELETE,
          id: eventPayload.entityId,
        });
        break;
      default:
        throw new Error(`${eventType} not supported for project month.`);
    }
  }
}
