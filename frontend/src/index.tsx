/* eslint-disable import/order */
/* eslint-disable import/first */
import ReactDOM from "react-dom/client";
import {defaultLocale} from './components/utils';


if (process.env.NODE_ENV !== 'production') {
  document.title += ` - ${process.env.NODE_ENV || '???'}`;
}



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
  <Provider store={store}>
    <Routes />
  </Provider>
);
