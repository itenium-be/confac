import React, {Component} from 'react';
import * as Control from '../../../controls';
import InvoiceModel, { InvoiceLine } from '../../models/InvoiceModel';

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
      <td key="2" colSpan={4}>&nbsp;</td>
    ];
  }
}
