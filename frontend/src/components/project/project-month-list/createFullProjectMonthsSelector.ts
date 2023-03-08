import { createSelector } from 'reselect'
import moment from 'moment';
import { ConfacState } from '../../../reducers/app-state';
import { FullProjectMonthModel } from '../models/FullProjectMonthModel';
import { ProjectMonthModel } from '../models/ProjectMonthModel';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import { IProjectModel } from '../models/IProjectModel';
import { ClientModel } from '../../client/models/ClientModels';
import { ConsultantModel } from '../../consultant/models/ConsultantModel';
import { mapToProjectMonth } from '../../hooks/useProjects';


type ProjectMonthResolverState = {
  projectsMonth: ProjectMonthModel[];
  invoices: InvoiceModel[];
  projects: IProjectModel[];
  clients: ClientModel[];
  consultants: ConsultantModel[];
}

const selectProjectMonths = (state: ConfacState) => state.projectsMonth;
const selectProjects = (state: ConfacState) => state.projects;
const selectConsultants = (state: ConfacState) => state.consultants;
const selectClients = (state: ConfacState) => state.clients;
const selectInvoices = (state: ConfacState) => state.invoices;


export const createFullProjectMonthsSelector = () => createSelector(
  selectProjectMonths,
  selectProjects,
  selectConsultants,
  selectClients,
  selectInvoices,
  (_, month: string) => month,
  (projectsMonth, projects, consultants, clients, invoices, month) => {
    const context: ProjectMonthResolverState = {
      projectsMonth, projects, consultants, clients, invoices
    }
    return projectsMonth
      .filter(x => x.month.isSame(moment(month), 'month'))
      .map(x => mapToProjectMonth(context, x))
      .filter(x => x !== null) as FullProjectMonthModel[];
  }
);
