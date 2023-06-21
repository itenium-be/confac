import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes as Switch} from 'react-router-dom';
import {useDispatch} from 'react-redux';

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
import {ProjectMonthsLists} from './components/project/project-month-list/ProjectMonthsLists';
import {LoginPage} from './components/pages/login/LoginPage';
import {UnauthicatedAppLayout} from "./components/pages/login/UnauthicatedAppLayout";
import {UserPage} from './components/pages/user/UserPage';
import {UsersList} from './components/users/UsersList';
import {EditUser} from './components/users/EditUser';
import {EditRole} from './components/users/EditRole';
import {EditAdmin} from './components/admin/EditAdmin';
import {EditProjectMonths} from './components/project/EditProjectMonths';
import {ConsultantProjectsList} from './components/consultant/ConsultantProjectsList';
import {initialLoad} from './actions';
import {Home} from './components/home/Home';


const Routes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initialLoad());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/invoices/create" element={<AppWithLayout Component={EditInvoice} />} />
        <Route path="/invoices/:id" element={<AppWithLayout Component={EditInvoice} />} />
        <Route path="/invoices" element={<AppWithLayout Component={InvoiceList} />} />

        <Route path="/quotations/create" element={<AppWithLayout Component={EditInvoice} />} />
        <Route path="/quotations/:id" element={<AppWithLayout Component={EditInvoice} />} />
        <Route path="/quotations" element={<AppWithLayout Component={QuotationList} />} />

        <Route path="/clients/create" element={<AppWithLayout Component={EditClient} />} />
        <Route path="/clients/:id" element={<AppWithLayout Component={EditClient} />} />
        <Route path="/clients" element={<AppWithLayout Component={ClientList} />} />

        <Route path="/consultants/create" element={<AppWithLayout Component={EditConsultant} />} />
        <Route path="/consultants/projects" element={<AppWithLayout Component={ConsultantProjectsList} />} />
        <Route path="/consultants/:id" element={<AppWithLayout Component={EditConsultant} />} />
        <Route path="/consultants" element={<AppWithLayout Component={ConsultantsList} />} />

        <Route path="/monthly-invoicing" element={<AppWithLayout Component={ProjectMonthsLists} />} />
        <Route path="/projects/:month/:projectMonthId" element={<AppWithLayout Component={EditProjectMonths} />} />
        <Route path="/projects/create" element={<AppWithLayout Component={EditProject} />} />
        <Route path="/projects/:id" element={<AppWithLayout Component={EditProject} />} />
        <Route path="/projects" element={<AppWithLayout Component={ProjectsList} />} />

        <Route path="/config" element={<AppWithLayout Component={EditConfig} />} />
        <Route path="/admin" element={<AppWithLayout Component={EditAdmin} />} />

        <Route path="/user" element={<AppWithLayout Component={UserPage} />} />
        <Route path="/users/:id" element={<AppWithLayout Component={EditUser} />} />
        <Route path="/users" element={<AppWithLayout Component={UsersList} />} />
        <Route path="/roles/:id" element={<AppWithLayout Component={EditRole} />} />
        <Route path="/login" element={<UnauthicatedAppLayout Component={LoginPage} />} />

        <Route path="/" element={<AppWithLayout Component={ProjectMonthsLists} />} />
        <Route path="/home" element={<AppWithLayout Component={Home} />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
