import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { ACTION_TYPES } from './actions.js';

const defaultConfig = {
  nextInvoiceNumber: undefined,
  defaultClient: undefined,
};

const config = (state = defaultConfig, action) => {
  switch (action.type) {
  case ACTION_TYPES.CONFIG_FETCHED:
    console.log('CONFIG_FETCHED', action.config);
    return action.config;
  default:
    return state;
  }
};

const clients = (state = [], action) => {
  const { type, clients } = action;
  if (type === ACTION_TYPES.CLIENTS_FETCHED) {
    console.log('CLIENTS_FETCHED', clients);
    return clients;
  }
  return state;
};

const rootReducer = combineReducers({
  config,
  clients,
  routing: routerReducer
});

export default rootReducer;
