import {EditInvoiceDefaultLine} from './EditInvoiceDefaultLine';
import {EditInvoiceSectionLine} from './EditInvoiceSectionLine';
import {InvoiceLine} from '../../models/InvoiceLineModels';


const lineTypeComponentMapping: Record<string, typeof EditInvoiceSectionLine> = {
  section: EditInvoiceSectionLine,
};

export const createEditInvoiceLine = (line: InvoiceLine) => {
  const CustomLineComponent = lineTypeComponentMapping[line.type as string];
  if (CustomLineComponent) {
    return CustomLineComponent;
  }

  return EditInvoiceDefaultLine;
};
