import React from 'react';
import {ClientModel} from '../models/ClientModels';
import {ModalState} from '../../controls/Modal';
import {ClientModal} from './ClientModal';
import {ClientSelect} from './ClientSelect';
import {t} from '../../utils';
import {Button} from '../../controls/form-controls/Button';


type SelectWithCreateModalProps<TModel> = {
  client: TModel;
  onChange: (client: TModel) => void;
  modalId: ModalState;
  setModalId: (id: ModalState) => void;
}

export const ClientSelectWithCreateModal = ({client, onChange, modalId, setModalId}: SelectWithCreateModalProps<ClientModel>) => {
  return (
    <>
      {modalId && (
        <ClientModal
          client={modalId !== 'create' ? client : null}
          show={!!modalId}
          onClose={() => setModalId(null)}
          onConfirm={(updatedClient: ClientModel) => onChange(updatedClient)}
        />
      )}
      <div className="unset-split">
        <div>
          <ClientSelect
            label={t('invoice.client')}
            value={client && client._id}
            onChange={(clientId, clientModel) => onChange(clientModel)}
          />
        </div>
        <div style={{width: 120, position: 'relative'}}>
          <Button
            onClick={() => setModalId('create')}
            variant="light"
            size="sm"
            style={{position: 'absolute', bottom: 18, left: 5}}
          >
            {t('invoice.clientNew')}
          </Button>
        </div>
      </div>
    </>
  );
};
