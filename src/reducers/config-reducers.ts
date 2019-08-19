import { EditConfigModel } from '../components/config/EditConfigModel';
import { ACTION_TYPES } from '../actions';
import { defaultConfig } from './default-states';

// Config is stored on the backend

export const config = (state: EditConfigModel = defaultConfig, action): EditConfigModel => {
  switch (action.type) {
  case ACTION_TYPES.CONFIG_FETCHED:
    console.log('CONFIG_FETCHED', action.config); // eslint-disable-line
    return action.config;

  case ACTION_TYPES.CONFIG_UPDATE:
    return action.config;

  default:
    return state;
  }
};
