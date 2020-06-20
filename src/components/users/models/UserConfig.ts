import {FullFormConfig} from '../../../models';

export const defaultUserProperties: FullFormConfig = [
  {key: 'firstName'},
  {key: 'name'},
  {key: 'alias'},
  {key: 'email', component: 'email'},
  {key: 'roles', component: 'RolesSelect'},
  {key: 'active', component: 'switch'},
];


export const defaultRoleProperties: FullFormConfig = [
  {key: 'name'},
  {forceRow: true},
  {key: 'claims', component: 'ClaimsSelect', cols: 12},
];
