import {NumericInput} from '../../../controls/form-controls/inputs/NumericInput';
import {BasicMathInput} from '../../../controls/form-controls/inputs/BasicMathInput';
import {InvoiceLineTypeSelect} from '../../controls/InvoiceLineTypeSelect';
import {StringInput} from '../../../controls/form-controls/inputs/StringInput';
import {InvoiceLine, InvoiceLineActions} from '../../models/InvoiceLineModels';
import InvoiceModel from '../../models/InvoiceModel';

export type EditInvoiceLineProps = {
  lines: InvoiceLine[],
  onChange: (lines: InvoiceLine[]) => void,
  index: number,
  line: InvoiceLine,
  invoice?: InvoiceModel,
}

export const EditInvoiceDefaultLine = ({lines, invoice, index, onChange, line}: EditInvoiceLineProps) => {
  return [
    <td key="0">
      <StringInput
        value={line.desc}
        onChange={value => onChange(InvoiceLineActions.updateLine(lines, index, {desc: value}, invoice))}
      />
    </td>,
    <td key="1">
      <InvoiceLineTypeSelect
        label={undefined}
        value={line.type}
        onChange={value => onChange(InvoiceLineActions.updateLine(lines, index, {type: value}, invoice))}
      />
    </td>,
    <td key="2">
      <BasicMathInput
        float
        allowHours={line.type === 'hourly'}
        value={line.amount}
        onChange={value => onChange(InvoiceLineActions.updateLine(lines, index, {amount: value}, invoice))}
      />
    </td>,
    <td key="3">
      <BasicMathInput
        prefix="€"
        addOnMinWidth={925}
        float
        value={line.price}
        onChange={value => onChange(InvoiceLineActions.updateLine(lines, index, {price: value}, invoice))}
      />
    </td>,
    <td key="4">
      <NumericInput
        suffix="%"
        addOnMinWidth={925}
        float
        value={line.tax}
        onChange={value => onChange(InvoiceLineActions.updateLine(lines, index, {tax: value}, invoice))}
      />
    </td>,
  ];
};
