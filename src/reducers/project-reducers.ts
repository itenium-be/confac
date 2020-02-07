/* eslint-disable no-param-reassign */
import moment from 'moment';
import {ACTION_TYPES} from '../actions';
import {ProjectModel} from '../components/project/models/ProjectModel';
import {getNewProject} from '../components/project/models/getNewProject';


function mapProject(prj: ProjectModel): ProjectModel {
  prj.startDate = moment(prj.startDate);
  if (prj.endDate) {
    prj.endDate = moment(prj.endDate);
  }
  return {...getNewProject(), ...prj};
}

export const projects = (state: ProjectModel[] = [], action): ProjectModel[] => {
  switch (action.type) {
    case ACTION_TYPES.PROJECTS_FETCHED:
      return action.projects.map(mapProject);

    case ACTION_TYPES.PROJECT_UPDATE: {
      const newState = state.filter(x => x._id !== action.project._id);
      newState.push(mapProject(action.project));
      return newState;
    }

    default:
      return state;
  }
};
