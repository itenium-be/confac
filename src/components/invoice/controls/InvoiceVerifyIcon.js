import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { BusyVerifyIcon } from '../../controls.js';
import t from '../../../trans.js';
import { toggleInvoiceVerify } from '../../../actions/index.js';

class InvoiceVerifyIcon extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    toggleInvoiceVerify: PropTypes.func.isRequired,
  }
  render() {
    return (
      <BusyVerifyIcon
        model={this.props.invoice}
        style={{marginLeft: 8}}
        onClick={() => this.props.toggleInvoiceVerify(this.props.invoice)}
        title={t('invoice.verifyAction')}
      />
    );
  }
}

export const InvoiceVerifyIconToggle = connect(() => ({}), {toggleInvoiceVerify})(InvoiceVerifyIcon);
