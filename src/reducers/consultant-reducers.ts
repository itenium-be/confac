import {ConsultantModel} from '../components/consultant/models/ConsultantModel';
import {ACTION_TYPES} from '../actions';

export const consultants = (state: ConsultantModel[] = [], action): ConsultantModel[] => {
  switch (action.type) {
    case ACTION_TYPES.CONSULTANTS_FETCHED:
      return action.consultants;
    case ACTION_TYPES.CONSULTANT_UPDATE: {
      let newState: ConsultantModel[];
      if (!action.consultant._id) {
        newState = state.concat([action.consultant]);
      } else {
        newState = state.filter(m => m._id !== action.consultant._id);
        newState.push(action.consultant);
      }
      return newState;
    }
    default:
      return state;
  }
};
