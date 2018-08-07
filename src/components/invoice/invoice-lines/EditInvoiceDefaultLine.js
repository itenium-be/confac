import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EditInvoiceViewModel} from '../../util.js';
import * as Control from '../../controls.js';
import {EditInvoiceDeleteLineIcon} from './EditInvoiceDeleteLineIcon.js';

export class EditInvoiceDefaultLine extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    line: PropTypes.object.isRequired,
  }

  render() {
    const {index, onChange, invoice, line} = this.props;
    return (
      <tr key={index}>
        <td>
          <Control.StringInput
            value={line.desc}
            onChange={value => onChange(invoice.updateLine(index, {desc: value}))}
            data-tst={`line-${index}-desc`}
          />
        </td>

        <td>
          <Control.InvoiceLineTypeSelect
            type={line.type}
            onChange={value => onChange(invoice.updateLine(index, {type: value}))}
            data-tst={`line-${index}-type`}
          />
        </td>

        <td>
          <Control.NumericInput
            float
            value={line.amount}
            onChange={value => onChange(invoice.updateLine(index, {amount: value}))}
            data-tst={`line-${index}-amount`}
          />
        </td>

        <td>
          <Control.NumericInput
            prefix="€"
            addOnMinWidth={925}
            float
            value={line.price}
            onChange={value => onChange(invoice.updateLine(index, {price: value}))}
            data-tst={`line-${index}-price`}
          />
        </td>

        <td>
          <Control.NumericInput
            suffix="%"
            addOnMinWidth={925}
            float
            value={line.tax}
            onChange={value => onChange(invoice.updateLine(index, {tax: value}))}
            data-tst={`line-${index}-tax`}
          />
        </td>

        <td>
          <Control.TextareaInput
            style={{height: 35}}
            value={line.notes}
            onChange={value => onChange(invoice.updateLine(index, {notes: value}))}
            data-tst={`line-${index}-notes`}
          />
        </td>

        <td>
          <EditInvoiceDeleteLineIcon {...this.props} />
        </td>
      </tr>
    );
  }
}
