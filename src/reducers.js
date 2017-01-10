import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import moment from 'moment';
import { ACTION_TYPES } from './actions/ActionTypes.js';

const defaultConfig = {
  nextInvoiceNumber: undefined,
  defaultClient: undefined,
  isLoaded: false,
};

const config = (state = defaultConfig, action) => {
  switch (action.type) {
  case ACTION_TYPES.CONFIG_FETCHED:
    console.log('CONFIG_FETCHED', action.config); // eslint-disable-line
    return action.config;

  case ACTION_TYPES.CONFIG_UPDATE_NEXTINVOICE_NUMBER:
    return {...state, nextInvoiceNumber: state.nextInvoiceNumber + 1};

  case ACTION_TYPES.INITIAL_LOAD:
    return {...state, isLoaded: true};

  default:
    return state;
  }
};

const clients = (state = [], action) => {
  if (action.type === ACTION_TYPES.CLIENTS_FETCHED) {
    console.log('CLIENTS_FETCHED', action.clients); // eslint-disable-line
    return action.clients;
  }
  return state;
};

function mapInvoice(invoice) {
  invoice.date = moment(invoice.date);
  return invoice;
}

const invoices = (state = [], action) => {
  switch (action.type) {
  case ACTION_TYPES.INVOICES_FETCHED:
    console.log('INVOICES_FETCHED', action.invoices); // eslint-disable-line
    return action.invoices.map(mapInvoice);

  case ACTION_TYPES.INVOICE_DELETED:
    return state.filter(invoice => invoice._id !== action.id);

  case ACTION_TYPES.INVOICE_ADDED:
    return state.concat([mapInvoice(action.invoice)]);

  case ACTION_TYPES.INVOICE_UPDATED: {
    let newState = state.filter(invoice => invoice._id !== action.invoice._id);
    newState.push(action.invoice);
    return newState;
  }

  default:
    return state;
  }
};

const rootReducer = combineReducers({
  config,
  clients,
  invoices,
  routing: routerReducer
});

export default rootReducer;
