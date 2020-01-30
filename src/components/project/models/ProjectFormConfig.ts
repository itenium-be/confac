import {FullFormConfig} from '../../../models';

export const projectFormConfig: FullFormConfig = [
  {key: 'startDate', component: 'date', cols: 3},
  {key: 'endDate', component: 'date', cols: 3},
  {key: 'client', label: '', component: 'EditProjectClient', cols: false},
  {key: 'partner', label: '', component: 'EditProjectPartner', cols: false},
];
