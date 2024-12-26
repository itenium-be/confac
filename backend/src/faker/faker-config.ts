import { ProjectConfig } from './models';


const projectConfig: ProjectConfig = {
  amount: 50, // amount of projects to insert

  // endDate: new Date('2023-02-01'),
  startDate: new Date('2024-01-01'),

  partnerProbability: 0.5,
  noEndDateProbability: 0.2,
};


const projectMonthsConfig = {
  // TODO: this is not implemented, use the UI?
  amount: 0,
};


const invoicesConfig = {
  // TODO: only works after having created some projectMonths (use UI)
  amount: 0,
}


export const config = {
  clients: 50, // amount of clients to insert
  consultants: 50, // amount of consultants to insert
  projects: projectConfig,
  invoices: invoicesConfig,
  projectMonths: projectMonthsConfig,
  roles: false, // insert basic admin role if it doesn't yet exist
};
