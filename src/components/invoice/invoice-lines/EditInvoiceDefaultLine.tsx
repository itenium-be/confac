import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EditInvoiceViewModel} from '../../util';
import * as Control from '../../controls';

export class EditInvoiceDefaultLine extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    line: PropTypes.object.isRequired,
  }

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
