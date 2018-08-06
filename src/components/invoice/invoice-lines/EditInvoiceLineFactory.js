import {EditInvoiceDefaultLine} from './EditInvoiceDefaultLine.js';
import {EditInvoiceSectionLine} from './EditInvoiceSectionLine.js';

const lineTypeComponentMapping = {
  section: EditInvoiceSectionLine
};

export const createEditInvoiceLine = function(line) {
  const CustomLineComponent = lineTypeComponentMapping[line.type];
  if (CustomLineComponent) {
    return CustomLineComponent;
  }

  return EditInvoiceDefaultLine;
}
