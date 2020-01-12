import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Form} from 'react-bootstrap';
import {t, formatDate} from '../utils';
import {BusyButton, ArrayInput} from '../controls';
import {AttachmentsForm} from '../controls/attachments/AttachmentsForm';
import {saveClient} from '../../actions/index';
import {defaultClientProperties} from './models/ClientConfig';
import {getNewClient} from './models/getNewClient';
import {ClientModel} from './models/ClientModels';
import {ConfacState} from '../../reducers/app-state';
import {ConfigModel} from '../config/models/ConfigModel';
import {StickyFooter} from '../controls/skeleton/StickyFooter';
import {NewClient} from './NewClient';


type EditClientProps = {
  config: ConfigModel,
  clients: ClientModel[],
  isLoaded: boolean,
  saveClient: (client: ClientModel) => void,
  match: {
    params: { id: string }
  },
  renavigationKey: string,
}

type EditClientState = {
  client: ClientModel,
  renavigationKey: string,
}

class EditClient extends Component<EditClientProps, EditClientState> {
  constructor(props: any) {
    super(props);
    this.state = {
      client: this.copyClient(props),
      renavigationKey: '',
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: EditClientProps) {
    if (nextProps.isLoaded !== this.props.isLoaded
      || nextProps.match.params.id !== this.props.match.params.id
      || nextProps.clients !== this.props.clients // Changing this? Check confac-back::invoices.js
      || nextProps.renavigationKey !== this.state.renavigationKey) {

      this.setState({client: this.copyClient(nextProps)});
    }
  }

  copyClient(props: EditClientProps): ClientModel {
    if (props.match.params.id) {
      // Existing client
      const client = props.clients.find(c => c.slug === props.match.params.id);
      if (client) {
        return JSON.parse(JSON.stringify(client));
      }
      // return {};
    }

    return getNewClient(props.config);
  }

  _onSave() {
    this.props.saveClient(this.state.client);
  }

  isClientDisabled(client: ClientModel): boolean {
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

  render() {
    const {client} = this.state;
    if (!client) {
      return null;
    }

    if (!client._id && !client.btw) {
      return (
        <NewClient
          client={client}
          onChange={(value: ClientModel) => this.setState({client: {...client, ...value}})}
        />
      );
    }

    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <h1>
              {client.name || (client._id ? '' : t('client.createNew'))}
              {client.createdOn && (
              <small className="created-on">
                {t('createdOn')}
                {' '}
                {formatDate(client.createdOn)}
              </small>
              )}
            </h1>
          </Row>
          <Row>
            <ArrayInput
              config={defaultClientProperties}
              model={client}
              onChange={value => this.setState({client: {...client, ...value}})}
              tPrefix="client."
            />
          </Row>

          <AttachmentsForm model={client} />

        </Form>
        <StickyFooter>
          <BusyButton
            onClick={() => this._onSave()}
            disabled={this.isClientDisabled(client)}
            data-tst="save"
          >
            {t('save')}
          </BusyButton>
        </StickyFooter>
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({
  clients: state.clients,
  isLoaded: state.app.isLoaded,
  config: state.config,
}), {saveClient})(EditClient);
