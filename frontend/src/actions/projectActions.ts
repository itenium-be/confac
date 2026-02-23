import {Moment} from 'moment';
import {api} from './utils/api-client';
import {catchHandler} from './utils/fetch';
import t from '../trans';
import {busyToggle, success} from './appActions';
import {ACTION_TYPES} from './utils/ActionTypes';
import {AppDispatch} from '../types/redux';
import {IProjectModel, ProjectProforma} from '../components/project/models/IProjectModel';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';
import {TimesheetCheckAttachmentType} from '../models';
import {FullProjectMonthModel} from '../components/project/models/FullProjectMonthModel';
import {EntityEventPayload} from '../components/socketio/EntityEventPayload';
import {SocketEventTypes} from '../components/socketio/SocketEventTypes';
import {store} from '../store';
import moment from 'moment';


export function saveProject(project: IProjectModel, navigate?: (path: string) => void, after: 'to-list' | 'to-details' = 'to-list') {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      const response = await api.post<IProjectModel>('/projects', project);
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
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}

export type SourceProjectData = {
  projectId: string;
  proforma?: ProjectProforma;
}


/** Create projectMonths for all active projects in the month */
export function createProjectsMonth(month: Moment, projectData: SourceProjectData[]) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await api.post<ProjectMonthModel[]>('/projects/month', {month, projectData});
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_FETCHED,
        projectsMonth: response.body,
      });
      success(t('config.popupMessage'));
    } catch (err) {
      catchHandler(err);
    }
  };
}



/** Create the invoice for a projectMonth */
export function createProjectsMonthInvoice(project: ProjectMonthModel) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await api.post<{projectsMonth: ProjectMonthModel; invoice: unknown}>(`/projects/month/${project._id}/create-invoice`);
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_INVOICE_CREATED,
        projectsMonth: response.body.projectsMonth,
        invoice: response.body.invoice,
      });
      success(t('config.popupMessage'));
    } catch (err) {
      catchHandler(err);
    }
  };
}




export function deleteProjectsMonth(id: string, navigate: (path: string) => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      await api.delete('/projects/month', {id});
      console.log('projectMonth deleted', id);
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_DELETE,
        id,
      });
      success(t('projectMonth.deleteConfirm.toastr'));
      navigate('/projects');
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
  };
}



export function deleteProject(id: string, navigate: (path: string) => void) {
  return async (dispatch: AppDispatch) => {
    dispatch(busyToggle());
    try {
      await api.delete('/projects', {id});
      console.log('project deleted', id);
      dispatch({
        type: ACTION_TYPES.PROJECT_DELETE,
        id,
      });
      success(t('project.deleteConfirm.toastr'));
      navigate('/projects');
    } catch (err) {
      catchHandler(err);
    } finally {
      dispatch(busyToggle.off());
    }
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


  return async (dispatch: AppDispatch) => {
    try {
      const response = await api.patch<ProjectMonthModel>('/projects/month', project);
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
        projectMonth: response.body,
      });
      success(t('config.popupMessage'));
    } catch (err) {
      catchHandler(err);
    }
  };
}

type ProjectMonthAttachmentTypes = 'Getekende timesheet' | 'Factuur freelancer' | 'Proforma Factuur';

export function projectMonthUpload(file: File, type: ProjectMonthAttachmentTypes, projectMonth: FullProjectMonthModel, fileName: string) {
  return async (dispatch: AppDispatch) => {
    const modelType = projectMonth.invoice ? 'invoice' : 'project_month';
    const modelId = projectMonth.invoice ? projectMonth.invoice._id : projectMonth._id;

    try {
      const response = await api.upload<{attachments: unknown[]} | ProjectMonthModel>(
        `/attachments/${modelType}/${modelId}/${type}`,
        fileName,
        file
      );
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
    } catch (err) {
      catchHandler(err);
    }
  };
}

export function projectsMonthOverviewUpload(file: File, month: Moment) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await api.upload(
        `/attachments/project_month_overview/${month.toISOString()}/${TimesheetCheckAttachmentType}`,
        file.name,
        file
      );
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_UPDATE,
        projectsMonthOverview: response.body,
      });
      success(t('config.popupMessage'));
    } catch (err) {
      catchHandler(err);
    }
  };
}

export function deleteProjectsMonthOverview(id: string) {
  return async (dispatch: AppDispatch) => {
    try {
      await api.delete(`/attachments/project_month_overview/${id}/${TimesheetCheckAttachmentType}`);
      dispatch({
        type: ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_DELETE,
        projectsMonthOverviewId: id,
      });
      success(t('config.popupMessage'));
    } catch (err) {
      catchHandler(err);
    }
  };
}

export function deleteProjectMonthAttachmentDetails(projectMonth: ProjectMonthModel) {
  return (dispatch: AppDispatch) => {
    dispatch({
      type: ACTION_TYPES.PROJECTS_MONTH_UPDATE,
      projectMonth: {...projectMonth, attachments: []},
    });
  };
}

export function handleProjectSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: AppDispatch) => {
    switch (eventType) {
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
  };
}

export function handleProjectMonthSocketEvents(eventType: SocketEventTypes, eventPayload: EntityEventPayload) {
  return (dispatch: AppDispatch) => {
    switch (eventType) {
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
  };
}
