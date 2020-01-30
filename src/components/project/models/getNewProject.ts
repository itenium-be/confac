import moment from 'moment';
import {ProjectMonthModel, ProjectModel} from './ProjectModel';

export const getNewProject = (): ProjectModel => ({
  _id: '',
  consultantId: '',
  startDate: moment().startOf('day'),
  partner: '',
  partnerTariff: 0,
  client: '',
  clientTariff: 0,
});


export const getNewProjectMonth = (): ProjectMonthModel => ({
  _id: '',
  month: moment.utc().startOf('month'),
  projectId: '',
});
