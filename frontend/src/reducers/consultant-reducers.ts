
import {ConsultantModel} from '../components/consultant/models/ConsultantModel';
import {ACTION_TYPES} from '../actions';
import {getNewConsultant} from '../components/consultant/models/getNewConsultant';
import {Action} from '../types/redux';


function mapConsultant(consultant: ConsultantModel): ConsultantModel {
  return {...getNewConsultant(), ...consultant};
}

export const consultants = (state: ConsultantModel[] = [], action: Action): ConsultantModel[] => {
  switch (action.type) {
    case ACTION_TYPES.CONSULTANTS_FETCHED:
      return action.consultants.map(mapConsultant);

    case ACTION_TYPES.CONSULTANT_UPDATE: {
      const newState = state.filter(x => x._id !== action.consultant._id);
      newState.push(mapConsultant(action.consultant));
      return newState;
    }

    default:
      return state;
  }
};
