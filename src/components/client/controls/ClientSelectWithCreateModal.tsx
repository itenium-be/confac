import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {ClientModel} from '../models/ClientModels';
import {ModalState} from '../../controls/Modal';
import {ClientModal} from './ClientModal';
import {ClientSelect} from './ClientSelect';
import {t} from '../../utils';
import {SelectWithCreateButton, SelectWithCreateModalProps} from '../../controls/form-controls/select/SelectWithCreateButton';
import {ConfacState} from '../../../reducers/app-state';


type ClientSelectWithCreateModalProps = SelectWithCreateModalProps<ClientModel> & {
  clientType: 'client' | 'partner';
}


export const PartnerSelectWithCreateModal = (props: ClientSelectWithCreateModalProps) => (
  <ClientSelectWithCreateModal {...props} clientType="partner" />
);



export const ClientSelectWithCreateModal = ({value, onChange, clientType = 'client'}: ClientSelectWithCreateModalProps) => {
  const [modalId, setModalId] = useState<ModalState>(null);
  const client = useSelector((state: ConfacState) => state.clients.find(c => c._id === value));

  return (
    <>
      {modalId && (
        <ClientModal
          client={modalId !== 'create' ? (client || null) : null}
          show={!!modalId}
          onClose={() => setModalId(null)}
          onConfirm={(model: ClientModel) => onChange(model._id, model)}
        />
      )}
      <SelectWithCreateButton setModalId={setModalId} createButtonText={`invoice.${clientType}New`}>
        <ClientSelect
          label={t(`invoice.${clientType}`)}
          value={value || ''}
          onChange={(id, model) => onChange(id, model)}
        />
      </SelectWithCreateButton>
    </>
  );
};
