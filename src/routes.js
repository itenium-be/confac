import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import App from './components/App.js';
import EditInvoice from './components/invoice/EditInvoice.js';
import InvoiceList from './components/invoice/InvoiceList.js';
import QuotationList from './components/quotation/QuotationList.js';
import ClientList from './components/client/ClientList.js';
import EditClient from './components/client/EditClient.js';
import EditConfig from './components/config/EditConfig.js';
import Login from './components/login/Login.js';
import Switch from 'react-ios-switch/lib/Switch';

export const PrivateRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={props =>
    localStorage.getItem("authToken") ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
        }}
       />
    )
   }
  />
);

const Routes = (
  <Route path="/" component={App}>
  <Switch>
    <IndexRoute component={InvoiceList} />
    <Route path="/invoice/create" component={EditInvoice} />
    <Route path="/invoice/:id" component={EditInvoice} />

    <PrivateRoute path="/quotations" component={QuotationList} />
    <PrivateRoute path="/quotation/create" component={EditInvoice} />
    <PrivateRoute path="/quotation/:id" component={EditInvoice} />

    <Route path="/clients" component={ClientList} />
    <Route path="/client/create" component={EditClient} />
    <Route path="/client/:id" component={EditClient} />

    <PrivateRoute path="/config" component={EditConfig} />

    <Route path="/login" component={Login}/>

    <Route path="*" component={InvoiceList}/>
    </Switch>
  </Route>

);

export default Routes;
