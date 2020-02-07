/* eslint-disable no-param-reassign */
import {ConsultantModel} from '../components/consultant/models/ConsultantModel';
import {ACTION_TYPES} from '../actions';

function mapConsultant(consultant: ConsultantModel): ConsultantModel {
  return consultant;
}

export const consultants = (state: ConsultantModel[] = [], action): ConsultantModel[] => {
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
