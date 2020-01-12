import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {t} from '../../utils';
import ClientDetails from '../../client/controls/ClientDetails';
import InvoiceTotal from './InvoiceTotal';
import {ClientModal} from '../../client/controls/ClientModal';
import InvoiceModel from '../models/InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {ClientSelect} from '../../client/controls/ClientSelect';
import {Button} from '../../controls/form-controls/Button';

type EditInvoiceClientProps = {
  invoice: InvoiceModel,
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
  constructor(props: EditInvoiceClientProps) {
    super(props);
    this.state = {modalClientId: undefined};
  }

  render() {
    const {invoice, onChange} = this.props;
    const dottedCellStyle = {border: '1px dotted black', padding: 10, height: '100%', width: '100%'};
    return (
      <div>
        {this.state.modalClientId && (
        <ClientModal
          client={this.state.modalClientId !== 'new' ? invoice.client : null}
          show={!!this.state.modalClientId}
          onClose={() => this.setState({modalClientId: null})}
          onConfirm={(updatedClient: ClientModel) => onChange({invoice: invoice.setClient(updatedClient)})}
        />
        )}
        <div className="unset-split">
          <div>
            <ClientSelect
              label={t('invoice.client')}
              value={invoice.client && invoice.client._id}
              onChange={(clientId, client) => onChange({invoice: invoice.setClient(client)})}
            />
          </div>
          <div style={{width: 120, position: 'relative'}}>
            <Button
              onClick={() => this.setState({modalClientId: 'new'})}
              variant="light"
              size="sm"
              style={{position: 'absolute', bottom: 18, left: 5}}
              data-tst="new-client"
            >
              {t('invoice.clientNew')}
            </Button>
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
