import React, {Component} from 'react';
import {t} from '../../util';

import * as Control from '../../controls';
import {Row, Col} from 'react-bootstrap';
import ClientDetails from '../../client/controls/ClientDetails';
import InvoiceTotal from './InvoiceTotal';
import {ClientModal} from '../../client/controls/ClientModal';
import EditInvoiceModel from '../models/EditInvoiceModel';

type EditInvoiceClientProps = {
  invoice: EditInvoiceModel,
  onChange: any,
}

type EditInvoiceClientState = {
  modalClientId?: string | null,
}

/**
 * Shows a ClientSelect
 * + Selected ClientDetails
 * + InvoiceTotal
 */
export class EditInvoiceClient extends Component<EditInvoiceClientProps, EditInvoiceClientState> {
  constructor(props) {
    super(props);
    this.state = {modalClientId: undefined};
  }

  render() {
    const {invoice, onChange} = this.props;
    const dottedCellStyle = {border: '1px dotted black', padding: 10, height: '100%', width: '100%'};
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
              variant="light"
              size="sm"
              style={{position: 'absolute', bottom: 18, left: 5}}
              data-tst="new-client"
            >
              {t('invoice.clientNew')}
            </Control.Button>
          </div>
        </div>

        {invoice.client ? (
          <Row>
            <Col md={6}>
              <div style={dottedCellStyle}>
                <ClientDetails
                  client={invoice.client}
                  onOpenDetails={() => this.setState({modalClientId: invoice.client._id})}
                  onOpenDetailsTitle="invoice.clientEditModal"
                />
              </div>
            </Col>
            <Col md={6}>
              <div style={dottedCellStyle}>
                <h4>{t('invoice.totalTitle')}</h4>
                <InvoiceTotal {...invoice.money} data-tst="invoice-total" />
              </div>
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}
