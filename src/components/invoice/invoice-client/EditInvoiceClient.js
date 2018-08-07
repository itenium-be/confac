import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
import {t} from '../../util.js';

import * as Control from '../../controls.js';
import {Row, Col} from 'react-bootstrap';
import ClientDetails from '../../client/controls/ClientDetails.js';
import InvoiceTotal from '../controls/InvoiceTotal.js';
// import {invoiceAction} from '../../../actions/index.js';


export class EditInvoiceClient extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const {invoice, onChange} = this.props;
    return (
      <div>
        <div className="unset-split">
          <div>
            <Control.ClientSelect
              label={t('invoice.client')}
              value={invoice.client}
              onChange={c => onChange({invoice: invoice.setClient(c)})}
            />
          </div>
          <div style={{width: 120, position: 'relative'}}>
            <Control.Button
              onClick={() => {}}
              bsSize="small"
              bsStyle="default"
              style={{position: 'absolute', bottom: 18, left: 5}}
              data-tst="new-client"
            >
              {t('invoice.clientNew')}
            </Control.Button>
          </div>
        </div>

        {invoice.client ? (
          <Row>
            <Col xs={6}>
              <ClientDetails client={invoice.client} />
            </Col>
            <Col xs={6}>
              <h4>{t('invoice.totalTitle')}</h4>
              <InvoiceTotal {...invoice.money} data-tst="invoice-total" />
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}
