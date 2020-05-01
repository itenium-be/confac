import {FullFormConfig} from '../../../models';

export const projectFormConfig: FullFormConfig = [
  {key: 'consultantId', component: 'ConsultantSelectWithCreateModal', cols: 5},
  {key: 'startDate', component: 'date', cols: 4},
  {key: 'endDate', component: 'date', cols: 3},
  {key: 'partner', label: '', component: 'EditProjectPartner', cols: false},
  {key: 'client', label: '', component: 'EditProjectClient', cols: false},
  {title: 'project.projectMonthConfig.titleConfig'},
  {key: 'projectMonthConfig.timesheetCheck', component: 'switch'},
  {key: 'projectMonthConfig.inboundInvoice', component: 'switch'},
  {key: 'projectMonthConfig.changingOrderNr', component: 'switch'},
  {title: 'notes'},
  {key: 'notes', label: '', component: 'TextEditor', cols: 12},
];
