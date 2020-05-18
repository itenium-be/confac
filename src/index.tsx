/* eslint-disable import/first */
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';


// TODO: need to fetch this from the backend
if (process.env.NODE_ENV !== 'production') {
  document.title += ` - ${process.env.NODE_ENV || '???'}`;
}



import moment from 'moment';
import 'moment/locale/nl';
import 'moment/locale/fr';

moment.locale('nl');


import {registerLocale, setDefaultLocale} from 'react-datepicker';
import nl from 'date-fns/locale/nl';

registerLocale('nl', nl);
setDefaultLocale('nl');

// ATTN: See util.ts for numeral nl configuration


// Load css
import './index.scss';



// Fetch data from the db
import {Provider} from 'react-redux';
import {store} from './store';
import {initialLoad} from './actions/index';

store.dispatch(initialLoad());




// Create the AppRoot
import Routes from './routes';

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root'),
);
