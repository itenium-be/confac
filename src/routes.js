import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App.js';
import EditInvoice from './components/invoice/EditInvoice.js';
import InvoiceList from './components/invoice/InvoiceList.js';
import QuotationList from './components/quotation/QuotationList.js';
import ClientList from './components/client/ClientList.js';
import EditClient from './components/client/EditClient.js';
import EditConfig from './components/config/EditConfig.js';
import GoogleLoginComponent from './components/login/GoogleLogin';

/*const PrivateRoute = ({ component: Component, loggedIn, path, ...rest}) => {
  return (
  <Route
    path={path}
    {...rest}
    render={props => {
      return loggedIn === true ? <Component {...props} />
      : <Redirect to={{
        pathname:"/login",
        state: {
          history: path
        },
      }} />
    }}
    />
  );  
}; this is the way the docs tell you how to do it*/

function requireAuth(nextState, replace) {
  if (!sessionStorage.jwt) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname}
    })
  }
}
    
const Routes = (

  <Route path="/" component={App}>

    <IndexRoute component={InvoiceList} onEnter={requireAuth} />
    <Route path="/invoice/create" component={EditInvoice} onEnter={requireAuth} />
    <Route path="/invoice/:id" component={EditInvoice} onEnter={requireAuth} />

    <Route path="/quotations" loggedIn={false} component={QuotationList} onEnter={requireAuth} />
    <Route path="/quotation/create" loggedIn={false} component={EditInvoice} onEnter={requireAuth} />
    <Route path="/quotation/:id" loggedIn={false} component={EditInvoice} onEnter={requireAuth} />

    <Route path="/clients" component={ClientList} onEnter={requireAuth} />
    <Route path="/client/create" component={EditClient} onEnter={requireAuth} />
    <Route path="/client/:id" component={EditClient} onEnter={requireAuth} />

    <Route path="/config" component={EditConfig} onEnter={requireAuth} />

    <Route path="/login" component={GoogleLoginComponent}/>

    <Route path="*" component={InvoiceList} onEnter={requireAuth}/>
    
  </Route>

  

);

export default Routes;
