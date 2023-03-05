import { ProjectConfig } from './models';


const projectConfig: ProjectConfig = {
  amount: 0, // amount of projects to insert

  // endDate: new Date('2023-02-01'),
  startDate: new Date('2021-01-01'),

  partnerProbability: 0.5,
  noEndDateProbability: 0.2,
};


const projectMonthsConfig = {
  amount: 0,
};


const invoicesConfig = {
  amount: 0,
}


export const config = {
  clients: 0, // amount of clients to insert
  consultants: 0, // amount of consultants to insert
  projects: projectConfig,
  invoices: invoicesConfig,
  projectMonths: projectMonthsConfig,
  roles: false, // insert basic admin role if it doesn't yet exist
};
