import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import thunk from 'redux-thunk';
import * as confacReducers from './reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk)
)(createStore);

export const store = createStoreWithMiddleware(combineReducers({
  ...confacReducers,
  routing: routerReducer,
}), {});
