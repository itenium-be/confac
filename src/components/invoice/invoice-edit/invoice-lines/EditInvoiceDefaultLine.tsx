import React, {Component} from 'react';
import InvoiceModel, {InvoiceLine} from '../../models/InvoiceModel';
import {TextareaInput} from '../../../controls/form-controls/inputs/TextareaInput';
import {NumericInput} from '../../../controls/form-controls/inputs/NumericInput';
import {BasicMathInput} from '../../../controls/form-controls/inputs/BasicMathInput';
import {InvoiceLineTypeSelect} from '../../controls/InvoiceLineTypeSelect';
import {StringInput} from '../../../controls/form-controls/inputs/StringInput';

type EditInvoiceDefaultLineProps = {
  index: number,
  onChange: any,
  invoice: InvoiceModel,
  line: InvoiceLine
}

export class EditInvoiceDefaultLine extends Component<EditInvoiceDefaultLineProps> {
  render() {
    const {index, onChange, invoice, line} = this.props;
    return [
      <td key="0">
        <StringInput
          value={line.desc}
          onChange={value => onChange(invoice.updateLine(index, {desc: value}))}
        />
      </td>,
      <td key="1">
        <InvoiceLineTypeSelect
          label={null}
          value={line.type}
          onChange={value => onChange(invoice.updateLine(index, {type: value}))}
        />
      </td>,
      <td key="2">
        <BasicMathInput
          float
          allowHours={line.type === 'hourly'}
          value={line.amount}
          onChange={value => onChange(invoice.updateLine(index, {amount: value}))}
        />
      </td>,
      <td key="3">
        <BasicMathInput
          prefix="€"
          addOnMinWidth={925}
          float
          value={line.price}
          onChange={value => onChange(invoice.updateLine(index, {price: value}))}
        />
      </td>,
      <td key="4">
        <NumericInput
          suffix="%"
          addOnMinWidth={925}
          float
          value={line.tax}
          onChange={value => onChange(invoice.updateLine(index, {tax: value}))}
        />
      </td>,
      <td key="5">
        <TextareaInput
          style={{height: 35}}
          value={line.notes}
          onChange={(value: string) => onChange(invoice.updateLine(index, {notes: value}))}
        />
      </td>,
    ];
  }
}
