import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'react-select/dist/react-select.css';

import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers.js';

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk)
);

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

import { initialLoad } from './actions/index.js';
store.dispatch(initialLoad());

import Routes from './routes.js';

const Root = param => (
  <Provider store={param.store}>
    <Router history={param.history} routes={Routes} />
  </Provider>
);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
