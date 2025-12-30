import {OrderLine} from '../../../../../services/billit';
import {InvoiceLine} from '../../../../../models/invoices';
import {PeppolUnitLineCodes} from '../../../peppol-helpers';

/** Creates a Billit OrderLine from an InvoiceLine */
export function fromInvoiceLine(line: InvoiceLine): OrderLine {
  const isSection = line.type === 'section';
  const unitCode = PeppolUnitLineCodes.find(u => u.unit === line.type);

  return {
    Quantity: isSection ? undefined : line.amount,
    UnitPriceExcl: isSection ? undefined : line.price,
    Unit: unitCode?.code,
    Description: line.desc,
    VATPercentage: isSection ? undefined : line.tax,
  };
}
