import {useCallback, useEffect, useState} from 'react';
import {Container, Row, Form, Col} from 'react-bootstrap';
import {t} from '../../utils';
import {saveClient} from '../../../actions/clientActions';
import {requiredClientProperties} from '../models/ClientConfig';
import {getNewClient} from '../models/getNewClient';
import {ClientModel} from '../models/ClientModels';
import {ConfacState} from '../../../reducers/app-state';
import {btwResponseToModel} from '../NewClient';
import {BtwInput, BtwResponse} from '../../controls/form-controls/inputs/BtwInput';
import {ArrayInput} from '../../controls/form-controls/inputs/ArrayInput';
import {BaseModalProps, Modal} from '../../controls/Modal';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


type ClientModalProps = BaseModalProps & {
  title?: string,
  onConfirm?: (client: ClientModel) => void,
  client: ClientModel | null | string,
}


export const ClientModal = ({ title, onConfirm, client: initialClient, show, onClose }: ClientModalProps) => {
  const config = useSelector((state: ConfacState) => state.config);
  const storeClient = useSelector((state: ConfacState) => state.clients.find(x => x._id === initialClient));
  const dispatch = useDispatch();

  const copyClient = useCallback((fromStore: ClientModel | undefined, initialClientOrId: string | ClientModel | null): ClientModel => {
    if (fromStore || (initialClientOrId && typeof initialClientOrId === 'object')) {
      return JSON.parse(JSON.stringify(fromStore || initialClientOrId));
    }
    return getNewClient(config);
  }, [config]);

  const [client, setClient] = useState<ClientModel>(copyClient(storeClient, initialClient));

  useEffect(() => {
    setClient(copyClient(storeClient, initialClient));
  }, [storeClient, initialClient, copyClient]);

  const onSave = (): void => {
    const onSuccess = onConfirm ? (clientWithServerValues: ClientModel) => onConfirm(clientWithServerValues) : undefined;
    dispatch(saveClient(client, true, onSuccess) as any);
  };

  if (!client) {
    return null;
  }

  const modalTitle = title ?? t('client.createNewModal.client');

  return (
    <Modal
      show={show}
      onClose={onClose}
      title={client._id ? client.name : modalTitle}
      onConfirm={onSave}
      dialogClassName="client-modal"
      disableSave={!client.btw || !client.name}
    >
      {!client._id && !client.btw ? (
        <NewClientForm
          defaultBtw={client.btw}
          onFinalize={(btw: string, btwResp?: BtwResponse) => {
            if (btwResp && btwResp.valid) {
              setClient(btwResponseToModel(config, btwResp));
            } else {
              setClient({ ...client, btw: btw || ' ' });
            }
          }}
        />
      ) : (
        <Form>
          <Container>
            <Row>
              <ArrayInput
                config={requiredClientProperties}
                model={client}
                onChange={value => setClient({ ...client, ...value })}
                tPrefix="client."
              />
            </Row>
          </Container>
        </Form>
      )}
    </Modal>
  );
};



type NewClientFormProps = {
  defaultBtw: string;
  onFinalize: (btw: string, btwResp?: BtwResponse) => void;
  onBtwChange?: (btw: BtwResponse) => void;
}


const NewClientForm = ({defaultBtw, onFinalize}: NewClientFormProps) => {
  const config = useSelector((state: ConfacState) => state.config);
  const [btw, setBtw] = useState<string>(defaultBtw);
  const [btwResponse, setBtwResponse] = useState<ClientModel | null>(null);

  return (
    <>
      <BtwInput
        value={btw}
        onChange={(val: string) => setBtw(val)}
        onFinalize={onFinalize}
        onBtwChange={(btw: BtwResponse) => setBtwResponse(btwResponseToModel(config, btw))}
      />
      {btwResponse && (
        <Row style={{ marginTop: 25 }}>
          <Col>
            <h3>{btwResponse.name}</h3>
            <div>{btwResponse.address}</div>
            <div>{btwResponse.postalCode} {btwResponse.city}</div>
          </Col>
        </Row>
      )}
    </>
  );
};
