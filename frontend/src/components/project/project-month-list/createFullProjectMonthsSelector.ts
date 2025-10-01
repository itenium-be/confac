import {createSelector} from 'reselect';
import moment from 'moment';
import {ConfacState} from '../../../reducers/app-state';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ProjectMonthModel} from '../models/ProjectMonthModel';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {IProjectModel} from '../models/IProjectModel';
import {ClientModel} from '../../client/models/ClientModels';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {mapToProjectMonth} from '../../hooks/useProjects';
import {UserState} from '../../users/models/UserModel';


type ProjectMonthResolverState = {
  projectsMonth: ProjectMonthModel[];
  invoices: InvoiceModel[];
  projects: IProjectModel[];
  clients: ClientModel[];
  consultants: ConsultantModel[];
  user: UserState;
}

const selectProjectMonths = (state: ConfacState) => state.projectsMonth;
const selectProjects = (state: ConfacState) => state.projects;
const selectConsultants = (state: ConfacState) => state.consultants;
const selectClients = (state: ConfacState) => state.clients;
const selectInvoices = (state: ConfacState) => state.invoices;
const selectUser = (state: ConfacState) => state.user;

export const selectAllProjectMonths = createSelector(
  [
    selectProjectMonths,
    selectProjects,
    selectConsultants,
    selectClients,
    selectInvoices,
    selectUser,
  ],
  (projectsMonth, projects, consultants, clients, invoices, user) => {
    const context: ProjectMonthResolverState = {
      projectsMonth, projects, consultants, clients, invoices, user,
    };
    return projectsMonth
      .map(x => mapToProjectMonth(context, x))
      .filter(x => x !== null) as FullProjectMonthModel[];
  }
);


export const createFullProjectMonthsSelector = () => createSelector(
  [
    selectProjectMonths,
    selectProjects,
    selectConsultants,
    selectClients,
    selectInvoices,
    selectUser,
    (_, month: string) => month
  ],
  (projectsMonth, projects, consultants, clients, invoices, user, month) => {
    const context: ProjectMonthResolverState = {
      projectsMonth, projects, consultants, clients, invoices, user,
    };
    return projectsMonth
      .filter(x => x.month.isSame(moment(month), 'month'))
      .map(x => mapToProjectMonth(context, x))
      .filter(x => x !== null) as FullProjectMonthModel[];
  }
);
