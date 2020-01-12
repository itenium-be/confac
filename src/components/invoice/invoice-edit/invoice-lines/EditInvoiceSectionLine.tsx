import React, {Component} from 'react';
import InvoiceModel, {InvoiceLine} from '../../models/InvoiceModel';
import {StringInput} from '../../../controls/form-controls/inputs/StringInput';
import {InvoiceLineTypeSelect} from '../../controls/InvoiceLineTypeSelect';

type EditInvoiceSectionLineProps = {
  index: number,
  onChange: any,
  invoice: InvoiceModel,
  line: InvoiceLine,
}

export class EditInvoiceSectionLine extends Component<EditInvoiceSectionLineProps> {
  render() {
    const {index, onChange, invoice, line} = this.props;
    return [
      <td key="0">
        <StringInput
          value={line.desc}
          onChange={value => onChange(invoice.updateLine(index, {desc: value}))}
          data-tst={`line-${index}-desc`}
        />
      </td>,
      <td key="1">
        <InvoiceLineTypeSelect
          label={null}
          value={line.type}
          onChange={value => onChange(invoice.updateLine(index, {type: value}))}
          data-tst={`line-${index}-type`}
        />
      </td>,
      <td key="2" colSpan={4}>&nbsp;</td>,
    ];
  }
}
