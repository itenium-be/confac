import {FullFormConfig} from '../../../models';

export const defaultUserProperties: FullFormConfig = [
  {key: 'firstName'},
  {key: 'name'},
  {key: 'alias'},
  {key: 'email', component: 'email'},
];
