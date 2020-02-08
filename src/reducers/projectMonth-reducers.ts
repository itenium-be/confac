/* eslint-disable no-param-reassign */
import moment from 'moment';
import {ACTION_TYPES} from '../actions';
import {ProjectMonthModel} from '../components/project/models/ProjectMonthModel';
import {getNewProjectMonth} from '../components/project/models/getNewProject';

// TODO: We will not fetch all months, but just the months with status != OK

function mapProject(prj: ProjectMonthModel): ProjectMonthModel {
  prj.month = moment(prj.month);
  if (prj.inbound.dateReceived) {
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

    case ACTION_TYPES.PROJECTS_MONTH_UPDATE: {
      const newState = state.filter(x => x._id !== action.projectMonth._id);
      newState.push(mapProject(action.projectMonth));
      return newState;
    }

    default:
      return state;
  }
};
