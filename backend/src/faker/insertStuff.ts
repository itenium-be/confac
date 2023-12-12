import { Db } from 'mongodb';
import { config } from './faker-config';
import { getNewClient, getNewConsultant, getNewProjects, getNewProjectMonths, insertAdminRole, getNewInvoices } from './models';

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

  if (config.projectMonths.amount) {
    console.log(`Inserting ${config.projectMonths.amount} projectMonths`);
    const newProjects = await getNewProjectMonths(db, config.projects);
    await db.collection('projects_month').insertMany(newProjects);
  }
  
  if (config.invoices.amount) {
    console.log(`Inserting ${config.invoices.amount} invoices`);
    const newInvoices = await getNewInvoices(db, config.invoices);
    await db.collection('invoices').insertMany(newInvoices);
  }

  if (config.roles) {
    console.log(`Insert admin role?`);
    await insertAdminRole(db);
  }
}
