import {FullFormConfig} from '../../../models';

export const projectFormConfig: FullFormConfig = [
  {key: 'client.clientId', component: 'ProjectClientContractStatus', label: 'project.contract.frameworkAgreementTitle'},
  {key: 'contract', component: 'ContractStatusWithNotes', label: 'project.contract.projectTitle'},

  {title: {title: 'project.detailsTitle', level: 2}},
  {key: 'consultantId', component: 'ConsultantSelectWithCreateModal', cols: 5},
  {key: 'startDate', component: 'date', cols: 4},
  {key: 'endDate', component: 'date', cols: 3},
  {key: 'partner', label: '', component: 'EditProjectPartner', cols: false},
  {key: 'client', label: '', component: 'EditProjectClient', cols: false},

  {title: 'project.projectMonthConfig.titleConfig'},
  {key: 'projectMonthConfig.timesheetCheck', component: 'switch'},
  {key: 'projectMonthConfig.inboundInvoice', component: 'switch'},
  {key: 'projectMonthConfig.changingOrderNr', component: 'switch'},
  {key: 'client.advancedInvoicing', component: 'switch'},

  {title: 'client.notes'},
  {key: 'notes', label: '', component: 'TextEditor', cols: 12},
];


const HeaderSize = 3;

export const projectMonthFormProperties: FullFormConfig = [
  {key: 'verified', component: 'ProjectMonthStatusSelect', cols: 2},
  {key: 'month', component: 'month', cols: 2},
  {key: 'projectId', component: 'ProjectSelect', cols: 6},
  {key: 'orderNr', component: 'text', cols: 2},


  {title: {title: 'projectMonth.props.timesheet.title', level: HeaderSize}},
  {key: 'timesheet.validated', component: 'switch', cols: 12},
  {key: 'timesheet.timesheet', component: 'number', cols: 3},
  {key: 'timesheet.check', component: 'number', cols: 3},
  {key: 'timesheet.note', component: 'textarea', cols: 6},

  {title: {title: 'projectMonth.props.inbound.title', level: HeaderSize}},
  {key: 'inbound.status', component: 'ProjectMonthInboundStatusSelect', cols: 2, style: {display: 'block'}},
  {key: 'inbound.nr', component: 'text', cols: 4},
  {key: 'inbound.dateReceived', component: 'date', cols: 4},

  {title: {title: 'projectMonth.props.note', level: HeaderSize}},
  {key: 'note', label: '', component: 'TextEditor', cols: 12, props: {height: 150}},
];
