import React, {Component, PropTypes } from 'react';
import {connect } from 'react-redux';
import {t } from '../../util.js';

import {BusyButton } from '../../controls.js';
import {Alert } from 'react-bootstrap';
import {toggleInvoiceVerify } from '../../../actions/index.js';

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
    if (this.state.dismissed || invoice.isNew || invoice.verified) {
      return <div />;
    }

    return (
      <div>
        <Alert bsSize="small" bsStyle="info" onDismiss={() => this.setState({dismissed: true})}>
          {t('invoice.isNotVerified')}
          <div className="pull-right">
            <BusyButton
              bsStyle="success"
              onClick={() => toggleInvoiceVerify(invoice)}
              bsSize="small"
              style={{marginTop: -5, textTransform: 'uppercase'}}
            >
              {t('invoice.verifyAction')}
            </BusyButton>
          </div>
        </Alert>
      </div>
    );
  }
}

export default connect(() => ({}), {toggleInvoiceVerify})(InvoiceNotVerifiedAlert);
