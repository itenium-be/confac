import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

import './index.css';
import 'react-select/dist/react-select.css';

import { Router, Route, IndexRoute, browserHistory } from 'react-router';
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

import CreateInvoice from './invoice/CreateInvoice.js';

const Routes = (
  <Route path="/" component={App}>
    <IndexRoute component={CreateInvoice}/>
    <Route path="/invoice/create" component={CreateInvoice}/>
    <Route path="users" component={CreateInvoice}>
      <IndexRoute component={CreateInvoice}/>
      <Route path=":id" component={CreateInvoice}/>
    </Route>
  </Route>
);

const Root = ({store, history}) => (
  <Provider store={store}>
    <Router history={history} routes={Routes} />
  </Provider>
);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
