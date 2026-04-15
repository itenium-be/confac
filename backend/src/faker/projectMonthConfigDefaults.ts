// Copy of frontend/src/components/project/models/ProjectMonthModel.ts::getDefaultProjectMonthConfig.
// The frontend version is canonical — keep in sync if that branching changes.
import {ConsultantType} from './types';

export function getDefaultProjectMonthConfig(consultantType?: ConsultantType): {
  timesheetCheck: boolean;
  inboundInvoice: boolean;
} {
  switch (consultantType) {
    case 'manager':
      return {
        timesheetCheck: false,
        inboundInvoice: true,
      };

    case 'externalConsultant':
    case 'freelancer':
      return {
        timesheetCheck: false,
        inboundInvoice: true,
      };

    case 'consultant':
      return {
        timesheetCheck: true,
        inboundInvoice: false,
      };

    default:
      return {
        timesheetCheck: true,
        inboundInvoice: true,
      };
  }
}
