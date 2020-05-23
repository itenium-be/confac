import {EditInvoiceDefaultLine} from './EditInvoiceDefaultLine';
import {EditInvoiceSectionLine} from './EditInvoiceSectionLine';
import {InvoiceLine} from '../../models/InvoiceLineModels';


const lineTypeComponentMapping = {
  section: EditInvoiceSectionLine,
};

export const createEditInvoiceLine = (line: InvoiceLine) => {
  const CustomLineComponent = lineTypeComponentMapping[line.type];
  if (CustomLineComponent) {
    return CustomLineComponent;
  }

  return EditInvoiceDefaultLine;
};
