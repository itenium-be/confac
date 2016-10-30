import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

import './index.css';
import 'react-select/dist/react-select.css';

import CreateInvoice from './pages/CreateInvoice.js';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={CreateInvoice}/>
      <Route path="/invoice/create" component={CreateInvoice}/>
      <Route path="users" component={CreateInvoice}>
        <IndexRoute component={CreateInvoice}/>
        <Route path=":id" component={CreateInvoice}/>
      </Route>
    </Route>
  </Router>,
  document.getElementById('root')
);
