import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {AppWithLayout} from './components/AppWithLayout';
import EditInvoice from './components/invoice/invoice-edit/EditInvoice';
import InvoiceList from './components/invoice/invoice-list/InvoiceList';
import QuotationList from './components/invoice/invoice-list/QuotationList';
import {ClientList} from './components/client/ClientList';
import EditClient from './components/client/EditClient';
import EditConfig from './components/config/EditConfig';
import {EditConsultant} from './components/consultant/EditConsultant';
import {EditProject} from './components/project/EditProject';
import {ProjectsList} from './components/project/ProjectsList';
import {ConsultantsList} from './components/consultant/ConsultantsList';
import {ProjectMonthsLists} from './components/project/ProjectMonthsLists';
import {UnauthicatedAppLayout, LoginPage} from './components/pages/LoginPage';
import {UserPage} from './components/pages/UserPage';
import {UsersList} from './components/users/UsersList';
import {EditUser} from './components/users/EditUser';
import {EditRole} from './components/users/EditRole';
import {EditAdmin} from './components/admin/EditAdmin';



const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/invoices/create" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />
      <Route path="/invoices/:id" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />
      <Route path="/invoices" render={props => <AppWithLayout Component={InvoiceList} {...props} />} />

      <Route path="/quotations/create" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />
      <Route path="/quotations/:id" render={props => <AppWithLayout Component={EditInvoice} {...props} />} />
      <Route path="/quotations" render={props => <AppWithLayout Component={QuotationList} {...props} />} />

      <Route path="/clients/create" render={props => <AppWithLayout Component={EditClient} {...props} />} />
      <Route path="/clients/:id" render={props => <AppWithLayout Component={EditClient} {...props} />} />
      <Route path="/clients" render={props => <AppWithLayout Component={ClientList} {...props} />} />

      <Route path="/consultants/create" render={props => <AppWithLayout Component={EditConsultant} {...props} />} />
      <Route path="/consultants/:id" render={props => <AppWithLayout Component={EditConsultant} {...props} />} />
      <Route path="/consultants" render={props => <AppWithLayout Component={ConsultantsList} {...props} />} />

      <Route path="/monthly-invoicing" render={props => <AppWithLayout Component={ProjectMonthsLists} {...props} />} />
      <Route path="/projects/create" render={props => <AppWithLayout Component={EditProject} {...props} />} />
      <Route path="/projects/:id" render={props => <AppWithLayout Component={EditProject} {...props} />} />
      <Route path="/projects" render={props => <AppWithLayout Component={ProjectsList} {...props} />} />

      <Route path="/config" render={props => <AppWithLayout Component={EditConfig} {...props} />} />
      <Route path="/admin" render={props => <AppWithLayout Component={EditAdmin} {...props} />} />

      <Route path="/user" render={props => <AppWithLayout Component={UserPage} {...props} />} />
      <Route path="/users/:id" render={props => <AppWithLayout Component={EditUser} {...props} />} />
      <Route path="/users" render={props => <AppWithLayout Component={UsersList} {...props} />} />
      <Route path="/roles/:id" render={props => <AppWithLayout Component={EditRole} {...props} />} />
      <Route path="/login" render={props => <UnauthicatedAppLayout Component={LoginPage} {...props} />} />

      <Route path="/" render={props => <AppWithLayout Component={InvoiceList} {...props} />} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
