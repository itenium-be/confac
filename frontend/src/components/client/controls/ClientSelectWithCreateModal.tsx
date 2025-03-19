import {useState} from 'react';
import {useSelector} from 'react-redux';
import {ClientModel, ClientType} from '../models/ClientModels';
import {ModalState} from '../../controls/Modal';
import {ClientModal} from './ClientModal';
import {ClientSelect} from './ClientSelect';
import {t} from '../../utils';
import {SelectWithCreateButton, SelectWithCreateModalProps} from '../../controls/form-controls/select/SelectWithCreateButton';
import {ConfacState} from '../../../reducers/app-state';
import {Claim} from '../../users/models/UserModel';
import {Form} from 'react-bootstrap';
import {ClientIconLinks} from './ClientIconLinks';
import { getNewClient } from '../models/getNewClient';


type ClientSelectWithCreateModalProps = SelectWithCreateModalProps<ClientModel> & {
  clientType?: ClientType;
}


export const PartnerSelectWithCreateModal = (props: ClientSelectWithCreateModalProps) => (
  <ClientSelectWithCreateModal {...props} clientType="partner" />
);


export const EndCustomerSelectWithCreateModal = (props: ClientSelectWithCreateModalProps) => (
  <ClientSelectWithCreateModal {...props} clientType="endCustomer" />
);


export const ClientSelectWithCreateModal = ({value, onChange, clientType }: ClientSelectWithCreateModalProps) => {
  const [modalId, setModalId] = useState<ModalState>(null);
  const client = useSelector((state: ConfacState) => state.clients
    .filter(c => clientType === undefined || c.types.includes(clientType))
    .find(c => c._id === value)
  );

  const clientTypeName = clientType || 'client' // backwards compatibility, defaults to 'client'
  return (
    <>
      {modalId && (
        <ClientModal
          client={modalId !== 'create' ? (client || null) : {...getNewClient(), types: [clientTypeName]}}
          show={!!modalId}
          title={t(`client.createNewModal.${clientTypeName}`)}
          onClose={() => setModalId(null)}
          onConfirm={(model: ClientModel) => onChange(model._id, model)}
        />
      )}
      <SelectWithCreateButton claim={Claim.ManageClients} setModalId={setModalId} createButtonText={`invoice.${clientTypeName}New`}>
        <Form.Group className="form-group">
          <Form.Label>
            <span style={{marginRight: 8}}>{t(`invoice.${clientTypeName}`)}</span>
            {client && <ClientIconLinks client={client} />}
          </Form.Label>
          <ClientSelect value={value || ''} clientType={clientType} onChange={(id, model) => onChange(id, model)} />
        </Form.Group>
      </SelectWithCreateButton>
    </>
  );
};
