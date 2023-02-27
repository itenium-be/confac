/* eslint-disable import/order */
/* eslint-disable import/first */
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from "react-dom/client";
import {defaultLocale} from './components/utils';
import {GoogleOAuthProvider} from '@react-oauth/google';

import moment from 'moment';
import 'moment/locale/nl';
import 'moment/locale/fr';


moment.locale(defaultLocale);


import {registerLocale, setDefaultLocale} from 'react-datepicker';
import nl from 'date-fns/locale/nl';

registerLocale(defaultLocale, nl);
setDefaultLocale(defaultLocale);

// ATTN: See util.ts for numeral nl configuration


// Load css
import './index.scss';



// Fetch data from the db
import {Provider} from 'react-redux';
import {store} from './store';



// Create the AppRoot
import Routes from './routes';

// Removed <React.StrictMode>
// Console issue with react-beautiful-dnd in EditInvoiceLines.tsx
// https://stackoverflow.com/questions/60029734/react-beautiful-dnd-i-get-unable-to-find-draggable-with-id-1

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <GoogleOAuthProvider clientId="">
    <Provider store={store}>
      <Routes />
    </Provider>
  </GoogleOAuthProvider>
);
