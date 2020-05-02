import {ACTION_TYPES} from '../actions';
import {UserState} from '../components/users/models/UserModel';

const defaultUserState = {
  users: [],
};


export const users = (state: UserState = defaultUserState, action) => {
  switch (action.type) {
    case ACTION_TYPES.USERS_FETCHED:
      return {...state, users: action.users};

    case ACTION_TYPES.USER_UPDATE: {
      const newUsers = state.users.filter(x => x._id !== action.user._id);
      newUsers.push(action.user);
      return {...state, users: newUsers};
    }

    default:
      return state;
  }
};
