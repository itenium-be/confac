import React from 'react';
import {ClientModel} from '../../client/models/ClientModels';
import {ModalState} from '../../controls/Modal';
import {ClientModal} from '../../client/controls/ClientModal';
import {SelectWithCreateButton} from '../../controls/form-controls/select/SelectWithCreateButton';
import {ClientSelect} from '../../client/controls/ClientSelect';
import {t} from '../../utils';
import {Claim} from '../../users/models/UserModel';

type InvoiceClientSelectWithCreateModalProps = {
  client: ClientModel;
  onChange: (client: ClientModel) => void;
  modalId: ModalState;
  setModalId: (id: ModalState) => void;
}


/**
 * The ClientSelectWithCreateModal on the EditInvoice page
 * Is not compatible with InputArray
 */
export const InvoiceClientSelectWithCreateModal = ({client, onChange, modalId, setModalId}: InvoiceClientSelectWithCreateModalProps) => (
  <>
    {modalId && (
      <ClientModal
        client={modalId !== 'create' ? client : null}
        show={!!modalId}
        onClose={() => setModalId(null)}
        onConfirm={(updatedClient: ClientModel) => onChange(updatedClient)}
      />
    )}
    <SelectWithCreateButton claim={Claim.ManageClients} setModalId={setModalId} createButtonText="invoice.clientNew">
      <ClientSelect
        label={t('invoice.client')}
        value={client && client._id}
        onChange={(clientId, clientModel) => onChange(clientModel)}
      />
    </SelectWithCreateButton>
  </>
);
