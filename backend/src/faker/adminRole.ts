/* eslint-disable no-console */
import {Db} from 'mongodb';

const allClaims = [
  'view-config',
  'manage-config',
  'view-clients',
  'manage-clients',
  'view-projects',
  'manage-projects',
  'manage-projects-eccost',
  'delete-project',
  'view-quotations',
  'manage-quotations',
  'view-invoices',
  'manage-invoices',
  'validate-invoices',
  'email-invoices',
  'view-email-invoices',
  'view-projectMonth',
  'validate-projectMonth',
  'validate-projectMonthTimesheet',
  'validate-projectMonthInbound',
  'create-projectMonth',
  'edit-projectMonth',
  'delete-projectMonth',
  'view-users',
  'manage-users',
  'view-roles',
  'manage-roles',
  'view-consultants',
  'manage-consultants',
  'load-historical',
  'manage-comments',
];

const userClaims = [
  'view-config',
  'view-clients',
  'manage-clients',
  'view-projects',
  'manage-projects',
  'view-quotations',
  'manage-quotations',
  'view-invoices',
  'view-projectMonth',
  'edit-projectMonth',
  'view-consultants',
  'manage-consultants',
  'load-historical',
  'view-email-invoices',
];

const roles = [
  {name: 'admin', claims: allClaims},
  {name: 'user', claims: userClaims},
];

const users = [
  {
    email: 'admin@example.com', name: 'Admin', firstName: 'System', alias: 'admin', roles: ['admin'],
  },
  {
    email: 'user@example.com', name: 'User', firstName: 'Test', alias: 'user', roles: ['user'],
  },
  {
    email: 'john.doe@example.com', name: 'Doe', firstName: 'John', alias: 'jdoe', roles: ['user'],
  },
];

export async function insertRolesAndUsers(db: Db): Promise<void> {
  const rolesCollection = db.collection('roles');
  const usersCollection = db.collection('users');

  for (const role of roles) {
    const existing = await rolesCollection.findOne({name: role.name});
    if (existing) {
      console.log(`[faker] Role '${role.name}' already exists, skipping`);
    } else {
      await rolesCollection.insertOne({
        name: role.name,
        claims: role.claims,
        audit: {createdOn: new Date().toISOString(), createdBy: 'faker', modifiedOn: '', modifiedBy: ''},
      });
      console.log(`[faker] Role '${role.name}' inserted`);
    }
  }

  for (const user of users) {
    const existing = await usersCollection.findOne({email: user.email});
    if (existing) {
      console.log(`[faker] User '${user.email}' already exists, skipping`);
    } else {
      await usersCollection.insertOne({
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        alias: user.alias,
        active: true,
        roles: user.roles,
        audit: {createdOn: new Date().toISOString(), createdBy: 'faker', modifiedOn: '', modifiedBy: ''},
      });
      console.log(`[faker] User '${user.email}' inserted`);
    }
  }
}

// Keep backward compatibility
export const insertAdminRole = insertRolesAndUsers;
