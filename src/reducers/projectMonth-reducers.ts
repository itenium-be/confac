/* eslint-disable no-param-reassign */
import moment from 'moment';
import {ACTION_TYPES} from '../actions';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';
import {getNewProjectMonth} from '../components/project/models/getNewProject';

// TODO: We will not fetch all months, but just the months with !verified

function mapProject(prj: ProjectMonthModel): ProjectMonthModel {
  prj.month = moment(prj.month);
  if (prj.inbound && prj.inbound.dateReceived) {
    prj.inbound.dateReceived = moment(prj.inbound.dateReceived);
  }
  return {...getNewProjectMonth(), ...prj};
}


export const projectsMonth = (state: ProjectMonthModel[] = [], action): ProjectMonthModel[] => {
  switch (action.type) {
    case ACTION_TYPES.PROJECTS_MONTH_FETCHED: {
      const newProjects = action.projectsMonth.map(mapProject);
      if (!state.length) {
        return newProjects;
      }

      const newIds = action.projectsMonth.map((pm: ProjectMonthModel) => pm._id);
      return state.filter(pm => !newIds.includes(pm._id)).concat(newProjects);
    }

    case ACTION_TYPES.MODELS_UPDATED: {
      const toUpdate = action.payload.filter(x => x.type === 'projectMonth');
      const removeIds = toUpdate.map(x => x.model._id);
      const newState = state.filter(model => !removeIds.includes(model._id));
      toUpdate.forEach(model => newState.push(mapProject(model.model)));
      return newState;
    }

    case ACTION_TYPES.PROJECTS_MONTH_UPDATE: {
      const newState = state.filter(pm => pm._id !== action.projectMonth._id);
      newState.push(mapProject(action.projectMonth));
      return newState;
    }

    case ACTION_TYPES.PROJECTS_MONTH_DELETE: {
      const newState = state.filter(pm => pm._id !== action.id);
      return newState;
    }

    case ACTION_TYPES.PROJECTS_MONTH_ATTACHMENTS_UPDATE: {
      const projectMonth = state.find(pm => pm._id === action.projectMonth._id);
      const updatedProjectMonth = {...projectMonth, ...action.projectMonth};
      const newState = state.filter(pm => pm._id !== action.projectMonth._id);
      newState.push(mapProject(updatedProjectMonth));
      return newState;
    }

    default:
      return state;
  }
};
