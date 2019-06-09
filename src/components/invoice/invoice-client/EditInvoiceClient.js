import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t} from '../../util.js';

import * as Control from '../../controls.js';
import {Row, Col} from 'react-bootstrap';
import ClientDetails from '../../client/controls/ClientDetails.js';
import InvoiceTotal from '../controls/InvoiceTotal.js';
import {ClientModal} from '../../client/controls/ClientModal.js';


export class EditInvoiceClient extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {modalClientId: undefined};
  }

  render() {
    const {invoice, onChange} = this.props;
    return (
      <div>
        {this.state.modalClientId && <ClientModal
          client={this.state.modalClientId !== 'new' ? invoice.client : null}
          show={!!this.state.modalClientId}
          onClose={() => this.setState({modalClientId: null})}
          onConfirm={updatedClient => onChange({invoice: invoice.setClient(updatedClient)})}
        />}
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
              onClick={() => this.setState({modalClientId: 'new'})}
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
              <ClientDetails
                client={invoice.client}
                onOpenDetails={() => this.setState({modalClientId: invoice.client._id})}
                onOpenDetailsTitle="invoice.clientEditModal"
              />
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
