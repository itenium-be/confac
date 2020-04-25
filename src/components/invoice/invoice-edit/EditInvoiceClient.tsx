import React, {useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {t} from '../../utils';
import ClientDetails from '../../client/controls/ClientDetails';
import InvoiceTotal from './InvoiceTotal';
import InvoiceModel from '../models/InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {ModalState} from '../../controls/Modal';
import {ClientSelectWithCreateModal} from '../../client/controls/ClientSelectWithCreateModal';



type EditInvoiceClientProps = {
  invoice: InvoiceModel;
  onChange: (client: ClientModel) => void;
}


/**
 * Shows a ClientSelect
 * + Selected ClientDetails
 * + InvoiceTotal
 */
export const EditInvoiceClient = (props: EditInvoiceClientProps) => {
  const [modalId, setModalId] = useState<ModalState>(null);

  const {invoice, onChange} = props;
  const dottedCellStyle = {border: '1px dotted black', padding: 10, height: '100%', width: '100%'};
  return (
    <div>
      <ClientSelectWithCreateModal
        client={invoice.client}
        onChange={onChange}
        modalId={modalId}
        setModalId={setModalId}
      />
      {invoice.client ? (
        <Row>
          <Col md={6}>
            <div style={dottedCellStyle}>
              <ClientDetails
                client={invoice.client}
                onOpenDetails={() => setModalId(invoice.client._id)}
                onOpenDetailsTitle="invoice.clientEditModal"
              />
            </div>
          </Col>
          <Col md={6}>
            <div style={dottedCellStyle}>
              <h4>{t('invoice.totalTitle')}</h4>
              <InvoiceTotal {...invoice.money} />
            </div>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};
