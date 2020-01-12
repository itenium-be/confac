import moment from 'moment';
import {AppState} from '../models';
import {ConfigModel} from '../components/config/models/ConfigModel';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {ClientModel} from '../components/client/models/ClientModels';
import {ConsultantModel} from '../components/consultant/models';
import {ProjectModel, ProjectMonthModel} from '../components/project/models';

export type ConfacState = {
  app: AppState;
  config: ConfigModel;
  invoices: InvoiceModel[];
  clients: ClientModel[];
  consultants: ConsultantModel[];
  projects: ProjectModel[];
  projectsMonth: ProjectMonthModel[];
};

export const defaultAppState: AppState = {
  isLoaded: false,
  isBusy: false,
  busyCount: 0,
  invoiceFilters: {
    // search: [{value: moment().year(), label: moment().year(), type: 'year'}],
    search: [{value: 'last 3 months', label: 'last 3 months', type: 'manual_input'}], // See InvoiceListModel
    groupedByMonth: false,
    clientListYears: [moment().year()],
    freeInvoice: '',
    freeClient: '',
  },
  projectFilters: {
    searchFilterText: '',
    isShowingInActiveProjects: false,
  },
};
