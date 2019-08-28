import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {BusyVerifyIcon} from '../../controls';
import t from '../../../trans';
import {toggleInvoiceVerify} from '../../../actions/index';
import EditInvoiceModel from '../models/EditInvoiceModel';


type InvoiceVerifyIconProps = {
  invoice: EditInvoiceModel,
  toggleInvoiceVerify: Function,
}

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
