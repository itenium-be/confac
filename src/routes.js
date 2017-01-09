import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App.js';
import CreateInvoice from './components/invoice/CreateInvoice.js';
import ConfigForm from './components/config/ConfigForm.js';

const Routes = (
  <Route path="/" component={App}>
    <IndexRoute component={CreateInvoice}/>
    <Route path="/invoice/create" component={CreateInvoice}/>
    <Route path="/config" component={ConfigForm}>
      <IndexRoute component={CreateInvoice}/>
      <Route path=":id" component={CreateInvoice}/>
    </Route>
  </Route>
);

export default Routes;
