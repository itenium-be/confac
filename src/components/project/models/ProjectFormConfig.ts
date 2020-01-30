import {FullFormConfig} from '../../../models';

export const projectFormConfig: FullFormConfig = [
  {key: 'startDate', component: 'date', cols: 3},
  {key: 'endDate', component: 'date', cols: 3},
  {key: 'partner', component: 'ClientSelect', cols: 6},
  {key: 'partnerTariff', component: 'money', prefix: '€', cols: 6},
  {key: 'client', component: 'ClientSelect', cols: 6},
  {key: 'clientTariff', component: 'money', prefix: '€', cols: 6},
];
