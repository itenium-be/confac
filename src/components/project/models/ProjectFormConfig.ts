import {FullFormConfig} from '../../../models';

export const projectFormConfig: FullFormConfig = [
  {key: 'consultantId', component: 'ConsultantSelectWithCreateModal', cols: 6},
  {key: 'startDate', component: 'date', cols: 3},
  {key: 'endDate', component: 'date', cols: 3},
  {key: 'client', label: '', component: 'EditProjectClient', cols: false},
  {key: 'partner', label: '', component: 'EditProjectPartner', cols: false},
  {title: 'project.projectMonthConfig.titleConfig'},
  {key: 'projectMonthConfig.timesheetCheck', component: 'switch'},
  {key: 'projectMonthConfig.inboundInvoice', component: 'switch'},
  {key: 'projectMonthConfig.changingOrderNr', component: 'switch'},
];
