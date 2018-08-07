import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {t} from '../../util.js';

import {BusyButton} from '../../controls.js';
import {Alert} from 'react-bootstrap';
import {toggleInvoiceVerify} from '../../../actions/index.js';

class InvoiceNotVerifiedAlert extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    toggleInvoiceVerify: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {dismissed: false};
  }
  render() {
    const {invoice, toggleInvoiceVerify} = this.props; // eslint-disable-line
    if (this.state.dismissed || invoice.isNew || invoice.verified || invoice.isQuotation) {
      return <div />;
    }

    return (
      <div>
        <Alert style={{height: 52}} bsSize="small" bsStyle="info" onDismiss={() => this.setState({dismissed: true})} data-tst="invoice-verify-alert">
          <BusyButton
            bsStyle="info"
            onClick={() => toggleInvoiceVerify(invoice)}
            bsSize="small"
            style={{marginTop: -5, marginRight: 10, textTransform: 'uppercase'}}
            data-tst="invoice-verify"
          >
            {t('invoice.verifyAction')}
          </BusyButton>
          {t('invoice.isNotVerified')}
        </Alert>
      </div>
    );
  }
}

export default connect(() => ({}), {toggleInvoiceVerify})(InvoiceNotVerifiedAlert);
