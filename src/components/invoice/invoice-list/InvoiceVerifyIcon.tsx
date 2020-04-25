import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import t from '../../../trans';
import {toggleInvoiceVerify} from '../../../actions/index';
import InvoiceModel from '../models/InvoiceModel';
import {BusyVerifyIcon} from '../../controls/icons/VerifyIcon';


type InvoiceVerifyIconProps = {
  invoice: InvoiceModel,
  toggleInvoiceVerify: Function,
}

// eslint-disable-next-line react/prefer-stateless-function
class InvoiceVerifyIcon extends Component<InvoiceVerifyIconProps> {
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
