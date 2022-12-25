import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t} from '../utils';
import {saveClient} from '../../actions/index';
import {defaultClientProperties} from './models/ClientConfig';
import {getNewClient} from './models/getNewClient';
import {ClientModel} from './models/ClientModels';
import {ConfacState} from '../../reducers/app-state';
import {ConfigModel} from '../config/models/ConfigModel';
import {StickyFooter} from '../controls/other/StickyFooter';
import {NewClient} from './NewClient';
import {ArrayInput} from '../controls/form-controls/inputs/ArrayInput';
import {BusyButton} from '../controls/form-controls/BusyButton';
import {useDocumentTitle} from '../hooks/useDocumentTitle';
import {ClientAttachmentsForm} from './controls/ClientAttachmentsForm';
import {Audit} from '../admin/Audit';
import {Claim} from '../users/models/UserModel';
import {useParams} from 'react-router-dom';


function getClient(client: ClientModel | undefined, config: ConfigModel) {
  if (client) {
    return JSON.parse(JSON.stringify(client));
  }
  return getNewClient(config);
}


const EditClient = () => {
  const params = useParams();
  const config = useSelector((state: ConfacState) => state.config);
  const storeClient = useSelector((state: ConfacState) => state.clients.find(x => x.slug === params.id));
  const initClient = getClient(storeClient, config);
  const [client, setClient] = useState<ClientModel>(initClient);
  const dispatch = useDispatch();
  // useEffect(() => window.scrollTo(0, 0)); // TODO: each keystroke made it scroll to top :(
  useDocumentTitle('clientEdit', {name: client.name});


  const isClientDisabled = (client: ClientModel): boolean => {
    if (client.name.length === 0) {
      return true;
    }
    if (client.slug && client.slug.length === 0) {
      // slug can only be filled in for an existing invoice
      // (it's set on the backend create)
      return true;
    }
    return false;
  }


  if (!client) {
    return null;
  }

  if (!client._id) {
    return (
      <NewClient
        client={client}
        onChange={(value: ClientModel) => setClient({...client, ...value})}
      />
    );
  }

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <h1>
            {client.name || (client._id ? '' : t('client.createNew'))}
            <Audit audit={storeClient?.audit} />
          </h1>
        </Row>
        <Row>
          <ArrayInput
            config={defaultClientProperties}
            model={client}
            onChange={value => setClient({...client, ...value})}
            tPrefix="client."
          />
        </Row>

        <ClientAttachmentsForm model={client} />

      </Form>
      <StickyFooter claim={Claim.ManageClients}>
        <BusyButton
          onClick={() => dispatch(saveClient(client) as any)}
          disabled={isClientDisabled(client)}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
}

export default EditClient;
