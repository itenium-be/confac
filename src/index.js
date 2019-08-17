/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';


// TODO: need to fetch this from the backend
if (process.env.NODE_ENV !== 'production') {
  document.title += ' - ' + (process.env.NODE_ENV || '???');
}



import moment from 'moment';
moment.locale('nl');



// Load extra css
import './index.css';


import {store} from './store.js';


// Fetch data from the db
import {initialLoad} from './actions/index.js';
store.dispatch(initialLoad());




// Create the AppRoot
import {Provider} from 'react-redux';
import Routes from './routes.js';

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);
