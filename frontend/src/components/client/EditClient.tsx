import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Row, Form, Alert} from 'react-bootstrap';
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
import {Audit} from '../admin/audit/Audit';
import {Claim} from '../users/models/UserModel';
import {useParams} from 'react-router-dom';
import {InvoiceLine} from '../invoice/models/InvoiceLineModels';
import useEntityChangedToast from '../hooks/useEntityChangedToast';
import { NotesWithCommentsModalButton } from '../controls/form-controls/button/NotesWithCommentsModalButton';


/** Different spellings of "Belgium" */
export const belgiums = ['België', 'Belgium', 'Belgie'];


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
  const clientWithSameKbo = useSelector((state: ConfacState) => state.clients.filter(x => x.btw === client.btw).find(x => x.slug !== params.id));

  useEntityChangedToast(client._id);

  const dispatch = useDispatch();
  // useEffect(() => window.scrollTo(0, 0)); // TODO: each keystroke made it scroll to top :(
  useDocumentTitle('clientEdit', {name: client.name});


  if (storeClient && !client._id) {
    setClient(storeClient);
  }

  const clientAlreadyExists = !!clientWithSameKbo && client.btw && client.btw !== t('taxRequest');
  const isClientDisabled = (client: ClientModel): boolean => {
    if (clientAlreadyExists || client.name.length === 0) {
      return true;
    }
    if (client.slug && client.slug.length === 0) {
      // slug can only be filled in for an existing invoice
      // (it's set on the backend create)
      return true;
    }
    if (!client.btw)
      return true;

    return false;
  }


  if (!client) {
    return null;
  }

  const setClientIntercept = (newClient: ClientModel): void => {
    if (newClient.country && client.country !== newClient.country && !client.defaultInvoiceLines.length && !belgiums.includes(newClient.country)) {
      let btwRemark: string;
      switch (newClient.country) {
        case 'UK':
          btwRemark = 'Belgian VAT not applicable - Article 44 EU Directive 2006/112/EC';
          break;
        default:
          btwRemark = 'Vrijgesteld van BTW overeenkomstig art. 39bis W. BTW';
      }

      const invoiceLines = config.defaultInvoiceLines.map(x => ({...x, tax: 0}));
      invoiceLines.push({type: 'section', desc: btwRemark, sort: invoiceLines.length} as InvoiceLine);
      newClient.defaultInvoiceLines = invoiceLines;
    }
    setClient(newClient);
  };

  if (!client.btw && !initClient._id) {
    return (
      <NewClient
        client={client}
        onChange={(value: ClientModel) => setClientIntercept({...client, ...value})}
      />
    );
  }

  return (
    <Container className="edit-container">
      <Form>
        <Row>
          <h1 style={{marginBottom: 10}}>
            {client.name || (initClient._id ? '' : t('client.createNew'))}
            <NotesWithCommentsModalButton
                 claim={Claim.EditProjectMonth}
                 value={client}
                 onChange={val => setClient( { ...client, notes: val.notes || '', comments: val.comments} )}
                 title={t('client.comments')}
                 style={ {marginLeft: 6, marginBottom: 6}} />
            <Audit model={storeClient} modelType="client" />
          </h1>
          {clientAlreadyExists && <Alert variant="danger">{t('client.alreadyExists', {btw: client.btw})}</Alert>}
        </Row>
        <Row>
          <ArrayInput
            config={defaultClientProperties}
            model={client}
            onChange={value => setClientIntercept({...client, ...value})}
            tPrefix="client."
          />
        </Row>

        <ClientAttachmentsForm model={initClient} />

      </Form>
      <StickyFooter claim={Claim.ManageClients}>
        <BusyButton
          onClick={() => dispatch(saveClient(client) as any)}
          className="tst-save-client"
          disabled={isClientDisabled(client)}
        >
          {t('save')}
        </BusyButton>
      </StickyFooter>
    </Container>
  );
}

export default EditClient;
