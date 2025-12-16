import {useEffect} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router';
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
import {InboundInvoicesList} from './components/project/inbound-invoices/InboundInvoicesList';
import {LoginPage} from './components/pages/login/LoginPage';
import {UnauthicatedAppLayout} from './components/pages/login/UnauthicatedAppLayout';
import {UserPage} from './components/pages/user/UserPage';
import {UsersList} from './components/users/UsersList';
import {EditUser} from './components/users/EditUser';
import {EditRole} from './components/users/EditRole';
import {EditAdmin} from './components/admin/EditAdmin';
import {EditProjectMonths} from './components/project/EditProjectMonths';
import {ConsultantProjectsList} from './components/consultant/ConsultantProjectsList';
import {initialLoad} from './actions';
import {Home} from './components/home/Home';
import {socketService} from './components/socketio/SocketService';


const router = createBrowserRouter([
  {path: '/invoices/create', element: <AppWithLayout Component={EditInvoice} />},
  {path: '/invoices/:id', element: <AppWithLayout Component={EditInvoice} />},
  {path: '/invoices', element: <AppWithLayout Component={InvoiceList} />},

  {path: '/quotations/create', element: <AppWithLayout Component={EditInvoice} />},
  {path: '/quotations/:id', element: <AppWithLayout Component={EditInvoice} />},
  {path: '/quotations', element: <AppWithLayout Component={QuotationList} />},

  {path: '/clients/create', element: <AppWithLayout Component={EditClient} />},
  {path: '/clients/:id', element: <AppWithLayout Component={EditClient} />},
  {path: '/clients', element: <AppWithLayout Component={ClientList} />},

  {path: '/consultants/create', element: <AppWithLayout Component={EditConsultant} />},
  {path: '/consultants/projects', element: <AppWithLayout Component={ConsultantProjectsList} />},
  {path: '/consultants/:id', element: <AppWithLayout Component={EditConsultant} />},
  {path: '/consultants', element: <AppWithLayout Component={ConsultantsList} />},

  {path: '/monthly-invoicing', element: <AppWithLayout Component={ProjectMonthsLists} />},
  {path: '/inbound-invoices', element: <AppWithLayout Component={InboundInvoicesList} />},
  {path: '/projects/:month/:projectMonthId', element: <AppWithLayout Component={EditProjectMonths} />},
  {path: '/projects/create', element: <AppWithLayout Component={EditProject} />},
  {path: '/projects/:id', element: <AppWithLayout Component={EditProject} />},
  {path: '/projects', element: <AppWithLayout Component={ProjectsList} />},

  {path: '/config', element: <AppWithLayout Component={EditConfig} />},
  {path: '/admin', element: <AppWithLayout Component={EditAdmin} />},
  {path: '/user', element: <AppWithLayout Component={UserPage} />},
  {path: '/users/:id', element: <AppWithLayout Component={EditUser} />},
  {path: '/users', element: <AppWithLayout Component={UsersList} />},
  {path: '/roles/:id', element: <AppWithLayout Component={EditRole} />},
  {path: '/login', element: <UnauthicatedAppLayout Component={LoginPage} />},

  {path: '/', element: <AppWithLayout Component={ProjectMonthsLists} />},
  {path: '/home', element: <AppWithLayout Component={Home} />},
]);


const Routes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initialLoad());
    socketService.initialize(dispatch);
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default Routes;
