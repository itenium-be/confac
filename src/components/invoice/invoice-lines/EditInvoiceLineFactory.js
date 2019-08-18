import {EditInvoiceDefaultLine} from './EditInvoiceDefaultLine';
import {EditInvoiceSectionLine} from './EditInvoiceSectionLine';

const lineTypeComponentMapping = {
  section: EditInvoiceSectionLine
};

export const createEditInvoiceLine = function(line) {
  const CustomLineComponent = lineTypeComponentMapping[line.type];
  if (CustomLineComponent) {
    return CustomLineComponent;
  }

  return EditInvoiceDefaultLine;
};
