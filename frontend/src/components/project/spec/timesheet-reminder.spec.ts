import moment from 'moment';
import {hasOpenTimesheets, getTimesheetReminderEmail, timesheetReminderTo} from '../project-month-list/timesheet-reminder';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ProjectMonthStatus} from '../models/ProjectMonthModel';
import {ConfigModel} from '../../config/models/ConfigModel';

type RowOptions = {
  verified?: ProjectMonthStatus;
  timesheetDays?: number;
  hasInvoice?: boolean;
  email?: string;
};

const buildRow = (options: RowOptions = {}) => {
  const {verified = false, timesheetDays, hasInvoice = false, email = 'nobody@itenium.be'} = options;
  return {
    details: {verified, timesheet: {timesheet: timesheetDays}},
    consultant: {email},
    invoice: hasInvoice ? {_id: 'inv'} : undefined,
  } as unknown as FullProjectMonthModel;
};

const buildConfig = (emailSignature = '') => ({
  timesheetReminderTitle: 'Timesheet {{month}}',
  timesheetReminderBody: '<p>Please fill in {{month}}</p>',
  emailSignature,
}) as unknown as ConfigModel;

const month = moment('2026-09-01');


describe('hasOpenTimesheets', () => {
  it('is true for a projectMonth without invoice', () => {
    expect(hasOpenTimesheets([buildRow()])).toBe(true);
  });

  it('is false when the invoice was created', () => {
    expect(hasOpenTimesheets([buildRow({hasInvoice: true})])).toBe(false);
  });

  it('is false when forced', () => {
    expect(hasOpenTimesheets([buildRow({verified: 'forced'})])).toBe(false);
  });

  it('is true when one of the projectMonths is still open', () => {
    expect(hasOpenTimesheets([buildRow({hasInvoice: true}), buildRow()])).toBe(true);
  });

  it('is false for an empty month', () => {
    expect(hasOpenTimesheets([])).toBe(false);
  });
});


describe('getTimesheetReminderEmail', () => {
  it('sends to the timesheet mailbox', () => {
    const email = getTimesheetReminderEmail([buildRow()], month, buildConfig());
    expect(email.to).toBe(timesheetReminderTo);
  });

  it('bccs consultants without timesheet days', () => {
    const rows = [buildRow({email: 'a@itenium.be'}), buildRow({email: 'b@itenium.be', timesheetDays: 20})];
    expect(getTimesheetReminderEmail(rows, month, buildConfig()).bcc).toBe('a@itenium.be');
  });

  it('bccs a consultant with zero timesheet days only once', () => {
    const rows = [buildRow({email: 'a@itenium.be'}), buildRow({email: 'a@itenium.be'}), buildRow({email: 'b@itenium.be', timesheetDays: 0})];
    expect(getTimesheetReminderEmail(rows, month, buildConfig()).bcc).toBe('a@itenium.be');
  });

  it('does not bcc consultants of an invoiced or forced projectMonth', () => {
    const rows = [buildRow({email: 'a@itenium.be', hasInvoice: true}), buildRow({email: 'b@itenium.be', verified: 'forced'})];
    expect(getTimesheetReminderEmail(rows, month, buildConfig()).bcc).toBe('');
  });

  it('skips consultants without an email address', () => {
    expect(getTimesheetReminderEmail([buildRow({email: ''})], month, buildConfig()).bcc).toBe('');
  });

  it('appends the email signature', () => {
    const email = getTimesheetReminderEmail([buildRow()], month, buildConfig('<p>Team Finance</p>'));
    expect(email.body).toBe('<p>Please fill in September 2026</p><p>Team Finance</p>');
  });

  it('replaces {{month}} in subject and body', () => {
    const email = getTimesheetReminderEmail([buildRow()], month, buildConfig());
    expect(email.subject).toBe('Timesheet September 2026');
    expect(email.body).toBe('<p>Please fill in September 2026</p>');
  });
});
