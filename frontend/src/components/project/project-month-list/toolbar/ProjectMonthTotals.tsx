import { FullProjectMonthModel } from '../../models/FullProjectMonthModel';


export type ProjectMonthTotals = {
  total: number;
  verified: number;
  unverified: FullProjectMonthModel[];
  timesheetPending: FullProjectMonthModel[];
  timesheetPendingCount: number;
  inboundPending: FullProjectMonthModel[];
  inboundNew: FullProjectMonthModel[];
  inboundValidated: FullProjectMonthModel[];
  inboundPaid: FullProjectMonthModel[];
};
