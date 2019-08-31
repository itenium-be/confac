import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';
import moment from 'moment';
import {BusyButton, ArrayInput, AttachmentsForm, PropertiesSelect} from '../controls';
import {Container, Row, Col, Form} from 'react-bootstrap';
import {saveClient} from '../../actions/index';
import {defaultClientProperties, editClientRateConfig} from './models/ClientConfig';
import { getNewClient } from "./models/getNewClient";
import { ClientModel } from './models/ClientModels';
import { ConfacState } from '../../reducers/default-states';
import { ConfigModel } from '../config/models/ConfigModel';
import { EditClientDefaultOther } from './EditClientDefaultOther';
import { StickyFooter } from '../controls/skeleton/StickyFooter';
import { NewClient } from './NewClient';


type EditClientProps = {
  config: ConfigModel,
  clients: ClientModel[],
  isLoaded: boolean,
  saveClient: Function,
  match: {
    params: {id: string}
  }
}

class EditClient extends Component<EditClientProps, ClientModel> {
  constructor(props: any) {
    super(props);
    this.state = this.copyClient(props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isLoaded !== this.props.isLoaded
      || nextProps.match.params.id !== this.props.match.params.id
      || nextProps.clients !== this.props.clients) {

      this.setState({...this.copyClient(nextProps)});
    }
  }

  copyClient(props: EditClientProps) {
    if (props.match.params.id) {
      // Existing client
      const client = props.clients.find(c => c.slug === props.match.params.id);
      if (client) {
        return JSON.parse(JSON.stringify(client));
      }
      return null;
    }

    return getNewClient(props.config);
  }

  _onSave() {
    this.props.saveClient(this.state);
  }

  render() {
    const client: ClientModel = this.state;
    if (!client) {
      return null;
    }

    if (!client._id && !client.btw) {
      return (
        <NewClient
          client={client}
          onChange={(value: ClientModel) => {console.log('wiuuh', value); this.setState({...client, ...value})}}
        />
      );
    }

    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <h1>
              {client.name || (client._id ? '' : t('client.createNew'))}
              {client.createdOn && <small className="created-on">{t('createdOn')} {moment(client.createdOn).format('DD/MM/YYYY')}</small>}
            </h1>
          </Row>
          <Row>
            <ArrayInput
              title={t('client.contact')}
              config={defaultClientProperties}
              model={client}
              onChange={value => this.setState({...client, ...value})}
              tPrefix="config.company."
            />
          </Row>


          <Row>
            <ArrayInput
              title={t('client.rate.title')}
              config={editClientRateConfig}
              model={client.rate}
              onChange={value => this.setState({...client, rate: {...value}})}
              tPrefix="client.rate."
            />
            <Col sm={4}>
              <PropertiesSelect
                label={t('client.defaultExtraInvoiceFields')}
                values={client.defaultExtraInvoiceFields || []}
                onChange={value => this.setState({...client, defaultExtraInvoiceFields: value})}
                data-tst="client.defaultExtraInvoiceFields"
              />
            </Col>
          </Row>


          <EditClientDefaultOther client={client} onChange={value => this.setState(value)} />


          <AttachmentsForm model={client} />


        </Form>
        <StickyFooter>
          <BusyButton
            onClick={this._onSave.bind(this)}
            disabled={this.isClientDisabled(client)}
            data-tst="save"
          >
            {t('save')}
          </BusyButton>
        </StickyFooter>
      </Container>
    );
  }

  isClientDisabled(client: ClientModel) {
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
}

export default connect((state: ConfacState) => ({
  clients: state.clients,
  isLoaded: state.app.isLoaded,
  config: state.config,
}), {saveClient})(EditClient);
