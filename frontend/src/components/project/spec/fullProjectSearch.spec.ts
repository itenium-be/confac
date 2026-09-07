import {fullProjectSearch} from '../models/getProjectMonthFeature';
import {FullProjectMonthModel} from '../models/FullProjectMonthModel';
import {ProjectMonthListFilters} from '../../controls/table/table-models';
import {ProjectMonthStatus, ProjectMonthInboundStatus} from '../models/ProjectMonthModel';
import {InvoiceStatus} from '../../invoice/models/InvoiceModel';

type RowOptions = {
  verified?: ProjectMonthStatus;
  timesheetDays?: number;
  timesheetValidated?: boolean;
  invoiceStatus?: InvoiceStatus;
  hasInboundInvoice?: boolean;
  inboundStatus?: ProjectMonthInboundStatus;
};

const buildRow = (options: RowOptions = {}) => {
  const {
    verified = false, timesheetDays, timesheetValidated = false, invoiceStatus, hasInboundInvoice = false, inboundStatus = 'new',
  } = options;
  return {
    details: {verified, timesheet: {timesheet: timesheetDays, validated: timesheetValidated}, inbound: {status: inboundStatus}},
    project: {projectMonthConfig: {inboundInvoice: hasInboundInvoice}},
    invoice: invoiceStatus ? {status: invoiceStatus} : undefined,
  } as unknown as FullProjectMonthModel;
};

const filters = {freeText: '', unverifiedOnly: true} as ProjectMonthListFilters;

describe('fullProjectSearch unverifiedOnly', () => {
  it('hides a verified row', () => {
    expect(fullProjectSearch(filters, buildRow({verified: true}))).toBe(false);
  });

  it('hides a forced row', () => {
    expect(fullProjectSearch(filters, buildRow({verified: 'forced'}))).toBe(false);
  });

  it('hides a paid invoice without inbound invoice', () => {
    expect(fullProjectSearch(filters, buildRow({invoiceStatus: 'Paid'}))).toBe(false);
  });

  it('hides a paid invoice with a paid inbound invoice', () => {
    expect(fullProjectSearch(filters, buildRow({invoiceStatus: 'Paid', hasInboundInvoice: true, inboundStatus: 'paid'}))).toBe(false);
  });

  it('keeps a paid invoice with an unpaid inbound invoice', () => {
    expect(fullProjectSearch(filters, buildRow({invoiceStatus: 'Paid', hasInboundInvoice: true, inboundStatus: 'validated'}))).toBe(true);
  });

  it('keeps an unpaid invoice', () => {
    expect(fullProjectSearch(filters, buildRow({invoiceStatus: 'ToPay'}))).toBe(true);
  });

  it('keeps a row without an invoice', () => {
    expect(fullProjectSearch(filters, buildRow())).toBe(true);
  });

  it('keeps everything when the filter is off', () => {
    const off = {freeText: '', unverifiedOnly: false} as ProjectMonthListFilters;
    expect(fullProjectSearch(off, buildRow({verified: true}))).toBe(true);
  });
});


describe('fullProjectSearch openTimesheetsOnly', () => {
  const openTimesheets = {freeText: '', openTimesheetsOnly: true} as ProjectMonthListFilters;

  it('keeps a row without timesheet days', () => {
    expect(fullProjectSearch(openTimesheets, buildRow())).toBe(true);
  });

  it('hides a row with timesheet days filled in', () => {
    expect(fullProjectSearch(openTimesheets, buildRow({timesheetDays: 20}))).toBe(false);
  });

  it('hides a row with zero timesheet days', () => {
    expect(fullProjectSearch(openTimesheets, buildRow({timesheetDays: 0}))).toBe(false);
  });

  it('hides a validated timesheet', () => {
    expect(fullProjectSearch(openTimesheets, buildRow({timesheetValidated: true}))).toBe(false);
  });

  it('hides a forced projectMonth', () => {
    expect(fullProjectSearch(openTimesheets, buildRow({verified: 'forced'}))).toBe(false);
  });

  it('keeps a verified projectMonth without timesheet days', () => {
    expect(fullProjectSearch(openTimesheets, buildRow({verified: true}))).toBe(true);
  });

  it('keeps everything when the filter is off', () => {
    const off = {freeText: '', openTimesheetsOnly: false} as ProjectMonthListFilters;
    expect(fullProjectSearch(off, buildRow({timesheetDays: 20}))).toBe(true);
  });

  it('combines with unverifiedOnly', () => {
    const both = {freeText: '', unverifiedOnly: true, openTimesheetsOnly: true} as ProjectMonthListFilters;
    expect(fullProjectSearch(both, buildRow({verified: true}))).toBe(false);
    expect(fullProjectSearch(both, buildRow())).toBe(true);
  });
});
