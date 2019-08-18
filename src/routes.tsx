import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {AppWithLayout} from './components/AppWithLayout';
import EditInvoice from './components/invoice/EditInvoice';
import InvoiceList from './components/invoice/InvoiceList';
import QuotationList from './components/quotation/QuotationList';
import ClientList from './components/client/ClientList';
import EditClient from './components/client/EditClient';
import EditConfig from './components/config/EditConfig';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/invoice/create" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />
      <Route path="/invoice/:id" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />

      <Route path="/quotation/create" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />
      <Route path="/quotation/:id" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />
      <Route path="/quotations" render={props => <AppWithLayout Component={QuotationList} {...props} />} />

      <Route path="/client/create" render={props => <AppWithLayout Component={EditClient} {...props} />} />
      <Route path="/client/:id" render={props => <AppWithLayout Component={EditClient} {...props} />} />
      <Route path="/clients" render={props => <AppWithLayout Component={ClientList} {...props} />} />

      <Route path="/config" render={props => <AppWithLayout Component={EditConfig} {...props} />} />

      <Route path="/" render={props => <AppWithLayout Component={InvoiceList} {...props} />} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
