import moment from 'moment';
import {ProjectModel, ProjectClientModel} from './ProjectModel';
import {ProjectMonthModel} from './ProjectMonthModel';


export const getNewProjectClient = (): ProjectClientModel => {
  return {clientId: '', rateType: 'daily', tariff: 0};
};


export const getNewProject = (): ProjectModel => ({
  _id: '',
  consultantId: '',
  startDate: moment().startOf('day'),
  client: getNewProjectClient(),
});


export const getNewProjectMonth = (): ProjectMonthModel => ({
  _id: '',
  month: moment.utc().startOf('month'),
  projectId: '',
  timesheet: {
    validated: false,
  },
});
