import {ACTION_TYPES} from '../actions';
import {ProjectModel} from '../components/project/models';

export const projects = (state: ProjectModel[] = [], action): ProjectModel[] => {
  switch (action.type) {
    case ACTION_TYPES.PROJECTS_FETCHED:
      return action.projects;
    case ACTION_TYPES.PROJECT_UPDATE: {
      const newState: ProjectModel[] = [...state, action.project];
      return newState;
    }
    default:
      return state;
  }
};
