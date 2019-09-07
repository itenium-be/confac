import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../../util';
import moment from 'moment';

import {BusyButton} from '../../controls';
import {Alert} from 'react-bootstrap';
import {toggleInvoiceVerify} from '../../../actions/index';
import InvoiceModel from '../models/InvoiceModel';
import { getInvoiceDueDateVariant } from '../invoice-list/InvoiceListRow';
import { ConfacState } from '../../../reducers/app-state';


type InvoiceNotVerifiedAlertProps = {
  invoice: InvoiceModel,
  toggleInvoiceVerify: Function,
  invoicePayDays: number,
}

type InvoiceNotVerifiedAlertState = {
  dismissed: boolean
}

class InvoiceNotVerifiedAlert extends Component<InvoiceNotVerifiedAlertProps, InvoiceNotVerifiedAlertState> {
  constructor(props: InvoiceNotVerifiedAlertProps) {
    super(props);
    this.state = {dismissed: false};
  }
  render() {
    const {invoice, toggleInvoiceVerify} = this.props; // eslint-disable-line
    if (this.state.dismissed || invoice.isNew || invoice.verified || invoice.isQuotation) {
      return null;
    }


    const variant = getInvoiceDueDateVariant(invoice, this.props.invoicePayDays) as any;
    const daysOpen = moment().diff(invoice.date, 'days');
    return (
      <div>
        <Alert variant={variant} onClose={() => this.setState({dismissed: true})} dismissible data-tst="invoice-verify-alert">
          <BusyButton
            variant={variant}
            onClick={() => toggleInvoiceVerify(invoice)}
            size="sm"
            style={{marginTop: -5, marginRight: 10, textTransform: 'uppercase'}}
            data-tst="invoice-verify"
          >
            {t('invoice.verifyAction')}
          </BusyButton>
          {t('invoice.isNotVerified')} <small>{t('invoice.notVerifiedFor', { days: daysOpen })}</small>
        </Alert>
      </div>
    );
  }
}

export default connect((state: ConfacState) => ({invoicePayDays: state.config.invoicePayDays}), {toggleInvoiceVerify})(InvoiceNotVerifiedAlert);
