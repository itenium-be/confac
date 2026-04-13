import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import {defaultLocale} from './components/utils';


if (import.meta.env.MODE !== 'production') {
  document.title += ` - ${import.meta.env.MODE || '???'}`;
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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </StrictMode>
);
