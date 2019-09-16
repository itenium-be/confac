import { ConfigModel } from '../components/config/models/ConfigModel';
import { ACTION_TYPES } from '../actions';
import { defaultConfig } from '../components/config/models/getNewConfig';

// Config is stored on the backend

export const config = (state: ConfigModel = defaultConfig, action): ConfigModel => {
  switch (action.type) {
  case ACTION_TYPES.CONFIG_FETCHED:
    console.log('CONFIG_FETCHED', action.config); // eslint-disable-line
    return {...defaultConfig, ...action.config};

  case ACTION_TYPES.CONFIG_UPDATE:
    return action.config;

  default:
    return state;
  }
};
