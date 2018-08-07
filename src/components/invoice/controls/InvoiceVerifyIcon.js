import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import {BusyVerifyIcon} from '../../controls.js';
import t from '../../../trans.js';
import {toggleInvoiceVerify} from '../../../actions/index.js';

class InvoiceVerifyIcon extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    invoice: PropTypes.object.isRequired,
    toggleInvoiceVerify: PropTypes.func.isRequired,
  }

  render() {
    const {invoice, toggleInvoiceVerify, ...props} = this.props; // eslint-disable-line
    if (invoice.isQuotation) {
      return null;
    }

    return (
      <BusyVerifyIcon
        model={invoice}
        style={{marginLeft: 8}}
        onClick={() => toggleInvoiceVerify(invoice)}
        title={invoice.verified ? t('invoice.verifyAction') : t('invoice.verifyActionTooltip', {days: moment().diff(invoice.date, 'days')})}
        {...props}
      />
    );
  }
}

export const InvoiceVerifyIconToggle = connect(() => ({}), {toggleInvoiceVerify})(InvoiceVerifyIcon);
