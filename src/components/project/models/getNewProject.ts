import moment from 'moment';
import {ProjectModel, ProjectClientModel} from './ProjectModel';
import {ProjectMonthModel, getDefaultProjectMonthConfig, ProjectMonthInbound,
  ProjectMonthTimesheet, ProjectMonthOutbound} from './ProjectMonthModel';


export const getNewProjectClient = (): ProjectClientModel => {
  return {clientId: '', rateType: 'daily', tariff: 0};
};


export const getNewProject = (): ProjectModel => ({
  _id: '',
  consultantId: '',
  startDate: moment().startOf('day'),
  client: getNewProjectClient(),
  projectMonthConfig: getDefaultProjectMonthConfig(),
});


export const getNewProjectMonth = (): ProjectMonthModel => ({
  _id: '',
  month: moment.utc().startOf('month'),
  projectId: '',
  timesheet: getNewProjectMonthTimesheet(),
  inbound: getNewProjectMonthInbound(),
  outbound: getNewProjectMonthOutbound(),
});

export const getNewProjectMonthInbound = (): ProjectMonthInbound => ({
  nr: '',
  status: 'new',
});

export const getNewProjectMonthTimesheet = (): ProjectMonthTimesheet => ({
  validated: false,
});

export const getNewProjectMonthOutbound = (): ProjectMonthOutbound => ({
  invoiceId: '',
  note: '',
});
