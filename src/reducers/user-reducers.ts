import {ACTION_TYPES} from '../actions';
import {UserState} from '../components/users/models/UserModel';

const defaultUserState = {
  users: [],
};


export const users = (state: UserState = defaultUserState, action) => {
  switch (action.type) {
    case ACTION_TYPES.USERS_FETCHED:
      return {...state, users: action.users};

    default:
      return state;
  }
};
