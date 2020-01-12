import {ConsultantModel} from '../components/consultant/models';
import {ACTION_TYPES} from '../actions';

export const consultants = (state: ConsultantModel[] = [], action): ConsultantModel[] => {
  switch (action.type) {
    case ACTION_TYPES.CONSULTANTS_FETCHED:
      return action.consultants;
    case ACTION_TYPES.CONSULTANT_UPDATE:
      const newState: ConsultantModel[] = [...state, action.consultant];
      return newState;
    default:
      return state;
  }
};
