import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EditInvoiceViewModel} from '../../util';
import * as Control from '../../controls';

export class EditInvoiceLineIcons extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    line: PropTypes.object.isRequired,
  }

  render() {
    return (
      <td>
        <EditInvoiceDeleteLineIcon {...this.props} />
      </td>
    );
  }
}


class EditInvoiceDeleteLineIcon extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    invoice: PropTypes.instanceOf(EditInvoiceViewModel).isRequired,
    line: PropTypes.object.isRequired,
  }

  render() {
    const {index, onChange, invoice} = this.props;
    if (!index) {
      return null;
    }

    return <Control.DeleteIcon onClick={() => onChange(invoice.removeLine(index))} data-tst={`line-${index}-delete`} />;
  }
}


export const EditInvoiceDragHandle = () => <td><Control.DragAndDropIcon /></td>;
