import moment from 'moment';
import {IProjectModel, ProjectClientModel, ProjectEndCustomerModel} from './IProjectModel';
import {ProjectMonthModel, getDefaultProjectMonthConfig, ProjectMonthInbound, ProjectMonthTimesheet} from './ProjectMonthModel';
import {IAudit} from '../../../models';
import {getNewInvoiceLine} from '../../invoice/models/InvoiceLineModels';
import {ContractStatus} from '../../client/models/ContractModels';


export const getNewProjectClient = (): ProjectClientModel => ({
  clientId: '',
  defaultInvoiceLines: [getNewInvoiceLine()],
  advancedInvoicing: false,
});

export const getNewProjectEndCustomer = (): ProjectEndCustomerModel => ({
  clientId: '',
  contact: '',
  notes: ''
})

export const getNewProject = (): IProjectModel => ({
  _id: '',
  consultantId: '',
  startDate: null as unknown as moment.Moment,
  client: getNewProjectClient(),
  projectMonthConfig: {
    changingOrderNr: false,
    ...getDefaultProjectMonthConfig(),
  },
  contract: {
    status: ContractStatus.NoContract,
    notes: '',
  },
  audit: {} as IAudit,
  forEndCustomer: false,
  endCustomer: null
});


export const getNewProjectMonth = (): ProjectMonthModel => ({
  _id: '',
  month: moment.utc().startOf('month'),
  projectId: '',
  timesheet: getNewProjectMonthTimesheet(),
  inbound: getNewProjectMonthInbound(),
  note: '',
  comments: [],
  orderNr: '',
  verified: false,
  attachments: [],
  audit: {} as IAudit,
});

export const getNewProjectMonthInbound = (): ProjectMonthInbound => ({
  nr: '',
  status: 'new',
});

export const getNewProjectMonthTimesheet = (): ProjectMonthTimesheet => ({
  validated: false,
  comments: []
});
