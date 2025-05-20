import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Row, Form, Alert } from 'react-bootstrap';
import { t } from '../utils';
import { saveClient } from '../../actions/index';
import { defaultClientProperties } from './models/ClientConfig';
import { ClientModel } from './models/ClientModels';
import { StickyFooter } from '../controls/other/StickyFooter';
import { NewClient } from './NewClient';
import { ArrayInput } from '../controls/form-controls/inputs/ArrayInput';
import { BusyButton } from '../controls/form-controls/BusyButton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ClientAttachmentsForm } from './controls/ClientAttachmentsForm';
import { Audit } from '../admin/audit/Audit';
import { Claim } from '../users/models/UserModel';
import useEntityChangedToast from '../hooks/useEntityChangedToast';
import { NotesWithCommentsModalButton } from '../controls/form-controls/button/NotesWithCommentsModalButton';
import { useClientState } from './client-helpers';


const EditClient = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {client, setClient, clientAlreadyExists, canSaveClient} = useClientState(params.id);

  useEntityChangedToast(client?._id);
  useDocumentTitle('clientEdit', {name: client?.name || ''});

  if (!client) {
    return (
      <NewClient onChange={(value: ClientModel) => setClient(value)} />
    );
  }

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <h1 style={{marginBottom: 10}}>
            {client.name || (client._id ? '' : t('client.createNew'))}
            <NotesWithCommentsModalButton
              claim={Claim.ManageClients}
              value={{comments: client.comments || []}}
              onChange={val => setClient({...client, comments: val.comments})}
              title={t('client.comments')}
              style={{marginLeft: 6, marginBottom: 6}}
              showNote={false}
            />
            <Audit model={client} modelType="client" />
          </h1>
          {clientAlreadyExists && (
            <Alert variant="danger">{t('client.alreadyExists', {btw: client.btw})}</Alert>
          )}
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
          className="tst-save-client"
          disabled={!canSaveClient}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
};

export default EditClient;
