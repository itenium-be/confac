import React from 'react';
import ReactDOM from 'react-dom';

const environment = require('../config-front.json').environment;
if (environment !== 'prod') {
  document.title += ' - ' + (environment || '???');
}



import moment from 'moment';
moment.locale('nl');



// Load extra css
import './index.css';
import 'react-select/dist/react-select.css';



import {store} from './store.js';


// Fetch data from the db
import {initialLoad} from './actions/index.js';
store.dispatch(initialLoad());




// Create the AppRoot
import {syncHistoryWithStore} from 'react-router-redux';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
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
