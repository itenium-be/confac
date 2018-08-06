import React, {Component, PropTypes} from 'react';
import {EditInvoiceViewModel} from '../../util.js';
import * as Control from '../../controls.js';

export class EditInvoiceDeleteLineIcon extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    line: PropTypes.object.isRequired,
  }

  render() {
    const {index, onChange, invoice} = this.props;
    return (
      <div>
        {index > 0 ? <Control.DeleteIcon onClick={() => onChange(invoice.removeLine(index))} data-tst={`line-${index}-delete`} /> : <div />}
      </div>
    );
  }
}
