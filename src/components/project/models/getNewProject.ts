import moment from 'moment';
import {ProjectModel, ProjectClientModel} from './ProjectModel';
import {ProjectMonthModel, getDefaultProjectMonthConfig, ProjectMonthInbound, ProjectMonthTimesheet} from './ProjectMonthModel';
import {IAudit} from '../../../models';
import {getNewInvoiceLine} from '../../invoice/models/InvoiceLineModels';


export const getNewProjectClient = (): ProjectClientModel => ({
  clientId: '',
  defaultInvoiceLines: [getNewInvoiceLine()],
  advancedInvoicing: false,
});


export const getNewProject = (): ProjectModel => ({
  _id: '',
  consultantId: '',
  startDate: null as unknown as moment.Moment,
  client: getNewProjectClient(),
  projectMonthConfig: {
    changingOrderNr: false,
    ...getDefaultProjectMonthConfig(),
  },
  audit: {} as IAudit,
});


export const getNewProjectMonth = (): ProjectMonthModel => ({
  _id: '',
  month: moment.utc().startOf('month'),
  projectId: '',
  timesheet: getNewProjectMonthTimesheet(),
  inbound: getNewProjectMonthInbound(),
  note: '',
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
});
