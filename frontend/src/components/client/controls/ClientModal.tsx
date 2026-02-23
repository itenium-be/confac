import {Container, Row, Form, Alert} from 'react-bootstrap';
import {t} from '../../utils';
import {saveClient} from '../../../actions/clientActions';
import {requiredClientProperties} from '../models/ClientConfig';
import {ClientModel, ClientType} from '../models/ClientModels';
import {NewClientForm} from '../NewClient';
import {ArrayInput} from '../../controls/form-controls/inputs/ArrayInput';
import {BaseModalProps, Modal} from '../../controls/Modal';
import {useClientState} from '../client-helpers';
import {useAppDispatch} from '../../../types/redux';


type ClientModalProps = BaseModalProps & {
  title?: string;
  onConfirm?: (client: ClientModel) => void;
  clientId: null | string | 'create';
  newClientTypes?: ClientType[];
}


export const ClientModal = ({title, onConfirm, clientId, show, onClose, newClientTypes}: ClientModalProps) => {
  const dispatch = useAppDispatch();
  const {client, setClient, clientAlreadyExists, canSaveClient} = useClientState(clientId || 'create');

  const onSave = (): void => {
    const onSuccess = onConfirm ? (clientWithServerValues: ClientModel) => onConfirm(clientWithServerValues) : undefined;
    dispatch(saveClient(client!, true, onSuccess));
  };

  const modalTitle = title ?? t('client.createNewModal.client');

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={client?._id ? client.name : modalTitle}
      onConfirm={onSave}
      dialogClassName="client-modal"
      disableSave={!!client && !canSaveClient}
    >
      {!client ? (
        <NewClientForm
          onFinalize={setClient}
          newClientTypes={newClientTypes}
          fullWidth
        />
      ) : (
        <Form>
          <Container>
            <Row>
              {clientAlreadyExists && (
                <Alert variant="danger">{t('client.alreadyExists', {btw: client.btw})}</Alert>
              )}
              <ArrayInput
                config={requiredClientProperties}
                model={client}
                onChange={value => setClient({...client, ...value})}
                tPrefix="client."
              />
            </Row>
          </Container>
        </Form>
      )}
    </Modal>
  );
};
