import {useState} from 'react';
import {useSelector} from 'react-redux';
import {ClientModel, ClientType} from '../models/ClientModels';
import {ClientModal} from './ClientModal';
import {ClientSelect} from './ClientSelect';
import {t} from '../../utils';
import {SelectWithCreateButton, SelectWithCreateModalProps} from '../../controls/form-controls/select/SelectWithCreateButton';
import {ConfacState} from '../../../reducers/app-state';
import {Claim} from '../../users/models/UserModel';
import {Form} from 'react-bootstrap';
import {ClientIconLinks} from './ClientIconLinks';


type ClientSelectWithCreateModalProps = SelectWithCreateModalProps<ClientModel> & {
  clientType?: ClientType;
}


export const PartnerSelectWithCreateModal = (props: ClientSelectWithCreateModalProps) => (
  <ClientSelectWithCreateModal {...props} clientType="partner" />
);


export const EndCustomerSelectWithCreateModal = (props: ClientSelectWithCreateModalProps) => (
  <ClientSelectWithCreateModal {...props} clientType="endCustomer" />
);


export const ClientSelectWithCreateModal = ({value, onChange, clientType = 'client'}: ClientSelectWithCreateModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const client = useSelector((state: ConfacState) => state.clients
    .filter(c => clientType === undefined || c.types.includes(clientType))
    .find(c => c._id === value)
  );

  return (
    <>
      {modalOpen && (
        <ClientModal
          clientId="create"
          newClientTypes={[clientType]}
          show
          title={t(`client.createNewModal.${clientType}`)}
          onClose={() => setModalOpen(false)}
          onConfirm={(model: ClientModel) => onChange(model._id, model)}
        />
      )}
      <SelectWithCreateButton claim={Claim.ManageClients} openCreateModal={() => setModalOpen(true)} createButtonText={`invoice.${clientType}New`}>
        <Form.Group className="form-group">
          <Form.Label>
            <span style={{marginRight: 8}}>{t(`invoice.${clientType}`)}</span>
            {client && <ClientIconLinks client={client} />}
          </Form.Label>
          <ClientSelect value={value || ''} clientType={clientType} onChange={(id, model) => onChange(id, model)} />
        </Form.Group>
      </SelectWithCreateButton>
    </>
  );
};
