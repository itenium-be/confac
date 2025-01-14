import {useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {t} from '../../utils';
import ClientDetails from '../../client/controls/ClientDetails';
import InvoiceTotal from './InvoiceTotal';
import InvoiceModel from '../models/InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {ModalState} from '../../controls/Modal';
import {InvoiceClientSelectWithCreateModal} from '../controls/InvoiceClientSelectWithCreateModal';



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
  return (
    <div>
      <InvoiceClientSelectWithCreateModal
        client={invoice.client}
        onChange={onChange}
        modalId={modalId}
        setModalId={setModalId}
      />
      {invoice.client ? (
        <Row className="dotted-cells-container">
          <Col md={6}>
            <div className="dotted-cell">
              <ClientDetails
                client={invoice.client}
                onOpenDetails={() => setModalId(invoice.client._id)}
                onOpenDetailsTitle="invoice.clientEditModal"
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="dotted-cell">
              <h4>{t('invoice.totalTitle')}</h4>
              <InvoiceTotal {...invoice.money} />
            </div>
          </Col>
        </Row>
      ) : null}
    </div>
  );
};
