import {ConfigModel} from '../components/config/models/ConfigModel';
import {ACTION_TYPES} from '../actions';
import {defaultConfig} from '../components/config/models/getNewConfig';
import moment from 'moment';

// Config is stored on the backend

export function mapConfig(config: ConfigModel): ConfigModel {
  return {
    ...config,
    peppolPivotDate: moment(config.peppolPivotDate || defaultConfig.peppolPivotDate)
  };
}

export const config = (state: ConfigModel = defaultConfig, action): ConfigModel => {
  switch (action.type) {
    case ACTION_TYPES.CONFIG_FETCHED:
      // console.log('CONFIG_FETCHED', action.config); // eslint-disable-line
      return {...defaultConfig, ...mapConfig(action.config)};

    case ACTION_TYPES.CONFIG_UPDATE:
      return mapConfig(action.config);

    default:
      return state;
  }
};
