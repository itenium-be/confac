/**
 * Totals for the ProjectMonthList badges
 * type number: amount of
 * type string: concat of the consultant names
 **/
export type ProjectMonthTotals = {
  total: number;
  verified: number;
  unverified: string;
  timesheetPending: string;
  timesheetPendingCount: number;
  inboundPending: string;
  inboundNew: string;
  inboundNewCount: number;
  inboundValidated: string;
  inboundValidatedCount: number;
  inboundPaid: string;
  inboundPaidCount: number;
};
