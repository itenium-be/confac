import React, {Component} from 'react';
import * as Control from '../../../controls';
import EditInvoiceModel, { EditInvoiceLine } from '../../models/EditInvoiceModel';

type EditInvoiceDefaultLineProps = {
  index: number,
  onChange: any,
  invoice: EditInvoiceModel,
  line: EditInvoiceLine
}

export class EditInvoiceDefaultLine extends Component<EditInvoiceDefaultLineProps> {
  render() {
    const {index, onChange, invoice, line} = this.props;
    return [
      <td key="0">
        <Control.StringInput
          value={line.desc}
          onChange={value => onChange(invoice.updateLine(index, {desc: value}))}
          data-tst={`line-${index}-desc`}
        />
      </td>
      ,
      <td key="1">
        <Control.InvoiceLineTypeSelect
          label=""
          type={line.type}
          onChange={value => onChange(invoice.updateLine(index, {type: value}))}
          data-tst={`line-${index}-type`}
        />
      </td>
      ,
      <td key="2">
        <Control.BasicMathInput
          float
          allowHours={line.type === 'hourly'}
          value={line.amount}
          onChange={value => onChange(invoice.updateLine(index, {amount: value}))}
          data-tst={`line-${index}-amount`}
        />
      </td>
      ,
      <td key="3">
        <Control.BasicMathInput
          prefix="€"
          addOnMinWidth={925}
          float
          value={line.price}
          onChange={value => onChange(invoice.updateLine(index, {price: value}))}
          data-tst={`line-${index}-price`}
        />
      </td>
      ,
      <td key="4">
        <Control.NumericInput
          suffix="%"
          addOnMinWidth={925}
          float
          value={line.tax}
          onChange={value => onChange(invoice.updateLine(index, {tax: value}))}
          data-tst={`line-${index}-tax`}
        />
      </td>
      ,
      <td key="5">
        <Control.TextareaInput
          style={{height: 35}}
          value={line.notes}
          onChange={value => onChange(invoice.updateLine(index, {notes: value}))}
          data-tst={`line-${index}-notes`}
        />
      </td>
    ];
  }
}
