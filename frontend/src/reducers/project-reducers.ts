
import moment from 'moment';
import {ACTION_TYPES} from '../actions';
import {IProjectModel} from '../components/project/models/IProjectModel';
import {getNewProject} from '../components/project/models/getNewProject';
import {Action} from '../types/redux';


function mapProject(prj: IProjectModel): IProjectModel {
  prj.startDate = moment(prj.startDate);
  if (prj.endDate) {
    prj.endDate = moment(prj.endDate);
  }
  return {...getNewProject(), ...prj};
}

export const projects = (state: IProjectModel[] = [], action: Action): IProjectModel[] => {
  switch (action.type) {
    case ACTION_TYPES.PROJECTS_FETCHED:
      return action.projects.map(mapProject);

    case ACTION_TYPES.PROJECT_UPDATE: {
      const newState = state.filter(x => x._id !== action.project._id);
      newState.push(mapProject(action.project));
      return newState;
    }

    case ACTION_TYPES.PROJECT_DELETE: {
      const newState = state.filter(x => x._id !== action.id);
      return newState;
    }

    default:
      return state;
  }
};
