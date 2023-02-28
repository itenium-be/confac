import moment from 'moment';
import {AppState} from '../models';
import {ConfigModel} from '../components/config/models/ConfigModel';
import InvoiceModel from '../components/invoice/models/InvoiceModel';
import {ClientModel} from '../components/client/models/ClientModels';
import {ConsultantModel} from '../components/consultant/models/ConsultantModel';
import {IProjectModel} from '../components/project/models/IProjectModel';
import {ProjectMonthModel, ProjectMonthOverviewModel} from '../components/project/models/ProjectMonthModel';
import {ListFilters, ProjectMonthListFilters} from '../components/controls/table/table-models';
import {UserState} from '../components/users/models/UserModel';

export type ConfacState = {
  app: AppState;
  config: ConfigModel;
  invoices: InvoiceModel[];
  clients: ClientModel[];
  consultants: ConsultantModel[];
  projects: IProjectModel[];
  projectsMonth: ProjectMonthModel[];
  /** Attachment details for a ProjectMonth (Timesheet check) */
  projectsMonthOverviews: ProjectMonthOverviewModel[];
  user: UserState;
};



const getListFilters = (showInactive = false): ListFilters => ({
  freeText: '',
  showInactive,
});


export const ProjectMonthsListFilterOpenMonthsFormat = 'YYYY-MM';


export const getProjectMonthsFilters = (projectMonths?: ProjectMonthModel[]): ProjectMonthListFilters => {
  let openMonths: {[key: string]: true} = {};
  if (projectMonths && projectMonths.length) {
    const lastExistingMonth = projectMonths
      .slice()
      .sort((a, b) => b.month.toISOString().localeCompare(a.month.toISOString()))[0]
      .month
      .format(ProjectMonthsListFilterOpenMonthsFormat);

    openMonths = {[lastExistingMonth]: true};
    // let leMonths = ['2023-01', '2022-12', '2022-11', '2022-10', '2022-09', '2022-08']; // 6 months open
    // leMonths = ['2023-01', '2021-08', '2021-09', '2021-10', '2021-11', '2021-12', '2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06', '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12'];
    // openMonths = leMonths.reduce((acc, cur) => ({...acc, [cur]: true}), {});
  }

  return {
    ...getListFilters(),
    openMonths,
    unverifiedOnly: false,
  };
};


export const defaultAppState: AppState = {
  isLoaded: false,
  isBusy: false,
  busyCount: 0,
  settings: {
    listSize: 100,
  },
  lastMonthsDownloaded: null,
  invoiceFilters: {
    // search: [{value: moment().year(), label: moment().year(), type: 'year'}],
    search: [{value: 'last 3 months', label: 'last 3 months', type: 'manual_input'}], // See InvoiceListModel
    groupedByMonth: false,
    freeInvoice: '',
  },
  filters: {
    consultants: getListFilters(),
    clients: {...getListFilters(), years: [moment().year()]},
    invoices: getListFilters(),
    projects: getListFilters(),
    projectMonths: {
      ...getListFilters(),
      openMonths: {},
      unverifiedOnly: false,
    },
    users: getListFilters(true),
    roles: getListFilters(),
  },
  securityConfig: {
    googleClientId: '',
    jwtInterval: 0,
    env: '',
    tag: ''
  }
};
