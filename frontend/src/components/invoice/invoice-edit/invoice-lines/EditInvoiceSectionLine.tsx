import {StringInput} from '../../../controls/form-controls/inputs/StringInput';
import {InvoiceLineTypeSelect} from '../../controls/InvoiceLineTypeSelect';
import {EditInvoiceLineProps} from './EditInvoiceDefaultLine';
import {InvoiceLineActions} from '../../models/InvoiceLineModels';

export const EditInvoiceSectionLine = ({lines, index, onChange, line, invoice}: EditInvoiceLineProps) => {
  return [
    <td key="0">
      <StringInput
        value={line.desc}
        onChange={value => onChange(InvoiceLineActions.updateLine(lines, index, {desc: value}, invoice))}
        data-testid="desc"
      />
    </td>,
    <td key="1">
      <InvoiceLineTypeSelect
        label={undefined}
        value={line.type}
        onChange={value => onChange(InvoiceLineActions.updateLine(lines, index, {type: value}, invoice))}
        data-testid="type"
      />
    </td>,
    <td key="2" colSpan={3}>&nbsp;</td>,
  ];
};
