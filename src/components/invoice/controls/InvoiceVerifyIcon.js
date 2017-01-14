import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {BusyVerifyIcon} from '../../controls.js';
import t from '../../../trans.js';
import {toggleInvoiceVerify} from '../../../actions/index.js';

class InvoiceVerifyIcon extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    toggleInvoiceVerify: PropTypes.func.isRequired,
  }

  render() {
    const {invoice} = this.props;
    return (
      <BusyVerifyIcon
        model={invoice}
        style={{marginLeft: 8}}
        onClick={() => this.props.toggleInvoiceVerify(invoice)}
        title={invoice.verified ? t('invoice.verifyAction') : t('invoice.verifyActionTooltip', {days: moment().diff(invoice.date, 'days')})}
      />
    );
  }
}

export const InvoiceVerifyIconToggle = connect(() => ({}), {toggleInvoiceVerify})(InvoiceVerifyIcon);
