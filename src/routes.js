import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App.js';
import EditInvoice from './components/invoice/EditInvoice.js';
import InvoiceList from './components/invoice/InvoiceList.js';
import ClientList from './components/client/ClientList.js';
import EditClient from './components/client/EditClient.js';
import EditConfig from './components/config/EditConfig.js';

const Routes = (
  <Route path="/" component={App}>
    <IndexRoute component={InvoiceList} />
    <Route path="/invoice/create" component={EditInvoice} />
    <Route path="/invoice/:id" component={EditInvoice} />

    <Route path="/clients" component={ClientList} />
    <Route path="/client/create" component={EditClient} />
    <Route path="/client/:id" component={EditClient} />

    <Route path="/config" component={EditConfig} />
  </Route>
);

export default Routes;
