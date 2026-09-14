import moment from 'moment';
import Handlebars from 'handlebars';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ConfigModel} from '../../config/models/ConfigModel';
import {EmailModel} from '../../controls/email/EmailModels';
import {getNewEmail} from '../../controls/email/getNewEmail';
import {ITextEditorCustomReplacement} from '../../invoice/invoice-replacements';


/** Also the reply-to of the reminder email */
export const timesheetReminderTo = 'timesheet@itenium.be';

export const timesheetReminderReplacementsConfig: ITextEditorCustomReplacement[] = [
  {code: '{{month}}', desc: 'config.timesheetReminderReplacements.month'},
];


/** An invoice or a forced ProjectMonth settles the timesheet: nothing left to remind about */
const isSettled = (projectMonth: FullProjectMonthModel): boolean => (
  !!projectMonth.invoice || projectMonth.details.verified === 'forced'
);


export const hasOpenTimesheets = (projectMonths: FullProjectMonthModel[]): boolean => projectMonths.some(pm => !isSettled(pm));


export function timesheetReminderReplacements(input: string, month: moment.Moment): string {
  return Handlebars.compile(input || '')({month: month.format('MMMM YYYY')});
}


export function getTimesheetReminderEmail(
  projectMonths: FullProjectMonthModel[],
  month: moment.Moment,
  config: ConfigModel,
): EmailModel {
  const bcc = projectMonths
    .filter(pm => !isSettled(pm) && typeof pm.details.timesheet?.timesheet !== 'number')
    .map(pm => pm.consultant.email)
    .filter(email => !!email);

  return getNewEmail({
    to: timesheetReminderTo,
    bcc: [...new Set(bcc)].join(';'),
    subject: timesheetReminderReplacements(config.timesheetReminderTitle, month),
    body: timesheetReminderReplacements(config.timesheetReminderBody, month) + config.emailSignature,
  });
}
