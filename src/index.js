import React from 'react';
import ReactDOM from 'react-dom';

// Load extra css
import './index.css';
import 'react-select/dist/react-select.css';




// Create the store
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import * as confacReducers from './reducers.js';
import { reducer as notificationsReducer } from 'reapop';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunk)
)(createStore);
const store = createStoreWithMiddleware(combineReducers({
  ...confacReducers,
  routing: routerReducer,
  notifications: notificationsReducer(require('./actions/appActions.js').notifySettings),
}), {});




// Fetch data from the db
import { initialLoad } from './actions/index.js';
store.dispatch(initialLoad());




// Create the AppRoot
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import Routes from './routes.js';

const history = syncHistoryWithStore(browserHistory, store);
const Root = param => (
  <Provider store={param.store}>
    <Router history={param.history} routes={Routes} />
  </Provider>
);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
