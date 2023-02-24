import {FullFormConfig} from '../../../models';

export const defaultConsultantProperties: FullFormConfig = [
  {key: 'firstName'},
  {key: 'name'},
  {key: 'slug', updateOnly: true},
  {key: 'type', component: 'ConsultantTypeSelect'},
  {key: 'email', component: 'email'},
  {key: 'telephone', component: 'phone'},
];


export const defaultConsultantModalProperties: FullFormConfig = [
  {key: 'firstName', cols: 6},
  {key: 'name', cols: 6},
  {key: 'email', component: 'email', cols: 6},
  {key: 'type', component: 'ConsultantTypeSelect', cols: 6},
  {key: 'telephone', component: 'phone', cols: 6},
];
