import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App.js';
import EditInvoice from './components/invoice/EditInvoice.js';
import InvoiceList from './components/invoice/InvoiceList.js';
import ConfigForm from './components/config/ConfigForm.js';

const Routes = (
  <Route path="/" component={App}>
    <IndexRoute component={InvoiceList} />
    <Route path="/invoice/create" component={EditInvoice} />
    <Route path="/invoice/:id" component={EditInvoice} />
    <Route path="/config" component={ConfigForm} />
  </Route>
);

export default Routes;
