import {createStore, applyMiddleware, compose, combineReducers } from 'redux';
import {routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import * as confacReducers from './reducers.js';
import {reducer as notificationsReducer } from 'reapop';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk)
)(createStore);

export const store = createStoreWithMiddleware(combineReducers({
  ...confacReducers,
  routing: routerReducer,
  notifications: notificationsReducer(require('./actions/appActions.js').notifySettings),
}), {});
