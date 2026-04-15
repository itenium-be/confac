/* eslint-disable no-console */
import {Db} from 'mongodb';

export async function insertAdminRole(db: Db): Promise<void> {
  const adminRoles = await db.collection('roles').find({name: 'admin'}).toArray();
  if (adminRoles.length) {
    console.log('[faker] Admin role already exists, skipping');
  } else {
    await db.collection('roles').insertOne({
      name: 'admin',
      claims: ['view-config', 'manage-config', 'view-users', 'manage-users', 'view-roles', 'manage-roles'],
      audit: {},
    });
    console.log('[faker] Admin role inserted');
  }
}
