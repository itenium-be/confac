/* eslint-disable no-console */
import {Db, ObjectID} from 'mongodb';
import {insertAdminRole} from './adminRole';
import {buildConfig} from './builders/buildConfig';
import {buildClient} from './builders/buildClient';
import {buildConsultant} from './builders/buildConsultant';
import {buildProject} from './builders/buildProject';
import {DEFAULT_CLIENT_SLUG} from './data/config';
import {partners} from './data/partners';
import {clients} from './data/clients';
import {endCustomers} from './data/endCustomers';
import {consultants as consultantRows} from './data/consultants';
import {projects as projectRows} from './data/projects';
import {BuildProjectMaps, ConsultantType} from './types';

const GUARDED = [
  {collection: 'config', filter: {key: 'conf'}},
  {collection: 'clients', filter: {}},
  {collection: 'consultants', filter: {}},
  {collection: 'projects', filter: {}},
] as const;

export async function insertStuff(db: Db): Promise<void> {
  // --- 0. Ensure admin role exists (always, even when fixture is skipped) ---
  await insertAdminRole(db);

  // --- 1. Guard: refuse to touch a non-empty DB ---
  for (const {collection, filter} of GUARDED) {
    const count = await db.collection(collection).countDocuments(filter);
    if (count > 0) {
      console.warn(`[faker] Skipping: '${collection}' already has ${count} doc(s). Running against a fresh DB is required.`);
      return;
    }
  }

  // --- 2. Config (defaultClient set later) ---
  const configDoc = buildConfig();
  await db.collection('config').insertOne(configDoc);
  console.log('[faker] Inserted config');

  // --- 3. Clients (partners ∪ clients ∪ endCustomers) ---
  const builtClients = [
    ...partners.map(r => buildClient(r, 'partner')),
    ...clients.map(r => buildClient(r, 'client')),
    ...endCustomers.map(r => buildClient(r, 'endCustomer')),
  ];
  const clientInsert = await db.collection('clients').insertMany(builtClients);
  console.log(`[faker] Inserted ${builtClients.length} clients`);

  const clientIds = new Map<string, ObjectID>();
  builtClients.forEach((c, i) => clientIds.set(c.slug, clientInsert.insertedIds[i]));

  // --- 4. Consultants ---
  const builtConsultants = consultantRows.map(buildConsultant);
  const consultantInsert = await db.collection('consultants').insertMany(builtConsultants);
  console.log(`[faker] Inserted ${builtConsultants.length} consultants`);

  const consultantIds = new Map<string, ObjectID>();
  const consultantTypes = new Map<string, ConsultantType>();
  builtConsultants.forEach((c, i) => {
    consultantIds.set(c.slug, consultantInsert.insertedIds[i]);
    consultantTypes.set(c.slug, c.type as ConsultantType);
  });

  // --- 5. Projects ---
  const maps: BuildProjectMaps = {clientIds, consultantIds, consultantTypes};
  const builtProjects = projectRows.map(row => buildProject(row, maps));
  await db.collection('projects').insertMany(builtProjects);
  console.log(`[faker] Inserted ${builtProjects.length} projects`);

  // --- 6. Set config.defaultClient to the designated main client ---
  const defaultClientId = clientIds.get(DEFAULT_CLIENT_SLUG);
  if (!defaultClientId) {
    throw new Error(`DEFAULT_CLIENT_SLUG '${DEFAULT_CLIENT_SLUG}' not found among inserted clients`);
  }
  await db.collection('config').updateOne(
    {key: 'conf'},
    {$set: {defaultClient: defaultClientId.toString()}},
  );
  console.log(`[faker] config.defaultClient -> ${DEFAULT_CLIENT_SLUG}`);
}
