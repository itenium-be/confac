import {OrderLine} from '../../../../../services/billit';
import {InvoiceLine} from '../../../../../models/invoices';
import {PeppolUnitLineCodes} from '../../../peppol-helpers';

export type OrderLineOptions = {
  invertAmounts?: boolean;
  accountingCode?: string;
};

/** Creates a Billit OrderLine from an InvoiceLine */
export function fromInvoiceLine(line: InvoiceLine, options: OrderLineOptions = {}): OrderLine {
  const {invertAmounts = false, accountingCode} = options;
  const isSection = line.type === 'section';
  const unitCode = PeppolUnitLineCodes.find(u => u.unit === line.type);
  const multiplier = invertAmounts ? -1 : 1;

  return {
    Quantity: isSection ? undefined : line.amount * multiplier,
    UnitPriceExcl: isSection ? undefined : line.price,
    Unit: unitCode?.code,
    Description: line.desc,
    VATPercentage: isSection ? undefined : line.tax,
    ...(accountingCode && {AnalyticCostBearer: accountingCode}),
  };
}
