import {ACTION_TYPES} from '../actions';
import {ProjectMonthModel} from '../components/project/models/types';

export const projectsMonth = (state: ProjectMonthModel[] = [], action): ProjectMonthModel[] => {
  switch (action.type) {
    case ACTION_TYPES.PROJECTS_MONTH_FETCHED:
      return action.projectsMonth;
    default:
      return state;
  }
};
