import {ACTION_TYPES} from '../actions';
import {ProjectMonthOverviewModel} from '../components/project/models/ProjectMonthModel';
import {Action} from '../types/redux';

export const projectsMonthOverviews = (state: ProjectMonthOverviewModel[] = [], action: Action): ProjectMonthOverviewModel[] => {
  switch (action.type) {
    case ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_FETCHED: {
      return action.projectsMonthOverviews;
    }

    case ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_UPDATE: {
      const updatedProjectsMonthOverviews = state.filter(p => p._id !== action.projectsMonthOverview._id);
      updatedProjectsMonthOverviews.push(action.projectsMonthOverview);
      return updatedProjectsMonthOverviews;
    }

    case ACTION_TYPES.PROJECTS_MONTH_OVERVIEWS_DELETE: {
      const updatedProjectsMonthOverviews = state.filter(p => p._id !== action.projectsMonthOverviewId);
      return updatedProjectsMonthOverviews;
    }

    default:
      return state;
  }
};
