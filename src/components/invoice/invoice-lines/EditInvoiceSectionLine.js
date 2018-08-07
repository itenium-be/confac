import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EditInvoiceViewModel} from '../../util.js';
import * as Control from '../../controls.js';
import {EditInvoiceDeleteLineIcon} from './EditInvoiceDeleteLineIcon.js';

export class EditInvoiceSectionLine extends Component {
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
        <td colSpan={4}>&nbsp;</td>
        <td>
          <EditInvoiceDeleteLineIcon {...this.props} />
        </td>
      </tr>
    );
  }
}
