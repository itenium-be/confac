import {ACTION_TYPES} from '../actions';
import {UserState, RoleModel} from '../components/users/models/UserModel';


function getRoles(): RoleModel[] {
  const roles = localStorage.getItem('roles');
  return roles ? JSON.parse(roles) : [];
}


const defaultUserState = {
  users: [],
  roles: getRoles(),
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



    case ACTION_TYPES.ROLES_FETCHED:
      localStorage.setItem('roles', JSON.stringify(action.roles));
      return {...state, roles: action.roles};

    case ACTION_TYPES.ROLE_UPDATE: {
      const newRoles = state.roles.filter(x => x._id !== action.role._id);
      newRoles.push(action.role);
      localStorage.setItem('roles', JSON.stringify(newRoles));
      return {...state, roles: newRoles};
    }


    default:
      return state;
  }
};
