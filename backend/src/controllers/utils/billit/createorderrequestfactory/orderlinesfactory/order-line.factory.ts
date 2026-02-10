import moment from 'moment/moment';
import {OrderLine} from '../../../../../services/billit';
import {InvoiceLine, InvoiceProjectMonth} from '../../../../../models/invoices';
import {PeppolUnitLineCodes} from '../../../peppol-helpers';

export type OrderLineOptions = {
  invertAmounts?: boolean;
  accountingCode?: string;
  projectMonth?: InvoiceProjectMonth;
};

function getDescription(line: InvoiceLine, projectMonth?: InvoiceProjectMonth): string {
  if (projectMonth?.month && projectMonth?.consultantName) {
    const monthFormatted = moment(projectMonth.month).format('M/YY');
    return `Consultancy - ${monthFormatted} - ${projectMonth.consultantName}`;
  }
  return line.desc;
}

/** Creates a Billit OrderLine from an InvoiceLine */
export function fromInvoiceLine(line: InvoiceLine, options: OrderLineOptions = {}): OrderLine {
  const {invertAmounts = false, accountingCode, projectMonth} = options;
  const isSection = line.type === 'section';
  const unitCode = PeppolUnitLineCodes.find(u => u.unit === line.type);
  const multiplier = invertAmounts ? -1 : 1;

  return {
    Quantity: isSection ? undefined : line.amount * multiplier,
    UnitPriceExcl: isSection ? undefined : line.price,
    Unit: unitCode?.code,
    Description: getDescription(line, projectMonth),
    VATPercentage: isSection ? undefined : line.tax,
    ...(accountingCode && {AnalyticCostBearer: accountingCode}),
  };
}
