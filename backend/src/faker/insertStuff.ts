import { Db } from 'mongodb';
import { getNewClient, getNewConsultant, getNewProjects, ProjectConfig, insertAdminRole } from './models';

const projectConfig: ProjectConfig = {
  amount: 0, // amount of projects to insert

  // endDate: undefined,
  // endDate: new Date('2022-12-31'),
  startDate: new Date('2023-01-01'),

  partnerProbability: 0.5,
  noEndDateProbability: 0.2,
}

const config = {
  clients: 0, // amount of clients to insert
  consultants: 0, // amount of consultants to insert
  projects: projectConfig,
  roles: true, // insert basic admin role if it doesn't yet exist
}


export async function insertStuff(db: Db) {
  if (config.clients) {
    console.log(`Inserting ${config.clients} clients`);
    const newClients = Array(config.clients).fill(0).map(getNewClient);
    await db.collection('clients').insertMany(newClients);
  }

  if (config.consultants) {
    console.log(`Inserting ${config.consultants} consultants`);
    const newConsultants = Array(config.consultants).fill(0).map(getNewConsultant);
    await db.collection('consultants').insertMany(newConsultants);
  }

  if (config.projects.amount) {
    console.log(`Inserting ${config.projects.amount} projects`);
    const newProjects = await getNewProjects(db, config.projects);
    await db.collection('projects').insertMany(newProjects);
  }

  if (config.roles) {
    console.log(`Insert admin role?`);
    await insertAdminRole(db);
  }
}
