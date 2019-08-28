import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';
import moment from 'moment';
import {BusyButton, StringInput, InputArray, AttachmentsForm, TextareaInput, PropertiesSelect, ExtraFieldsInput} from '../controls';
import {Container, Row, Col, Form} from 'react-bootstrap';
import {saveClient} from '../../actions/index';
import {EditClientRate} from './controls/EditClientRate';
import {getNewClient, defaultClientProperties} from './EditClientModel';
import * as Control from '../controls';
import { EditClientModel } from './ClientModels';
import { ConfacState } from '../../reducers/default-states';
import { EditConfigModel } from '../config/EditConfigModel';


type EditClientProps = {
  config: EditConfigModel,
  clients: EditClientModel[],
  isLoaded: boolean,
  saveClient: Function,
  match: {
    params: {id: string}
  }
}

class EditClient extends Component<EditClientProps, EditClientModel> {
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
    const client: any = this.state;
    if (!client) {
      return <div />;
    }

    return (
      <Container className="edit-container">
        <Form>
          <Row>
            <h1>
              {t('client.contact')}
              {client.createdOn && <small className="created-on">{t('createdOn')} {moment(client.createdOn).format('DD/MM/YYYY')}</small>}
            </h1>

            <InputArray
              config={defaultClientProperties}
              model={client}
              onChange={value => this.setState({...client, ...value})}
              tPrefix="config.company."
            />
          </Row>


          <Row>
            <Col sm={12}>
              <TextareaInput
                label={t('notes')}
                placeholder={t('notes')}
                value={client.notes}
                onChange={value => this.setState({...client, notes: value})}
                data-tst="client.notes"
                style={{height: 140}}
              />
            </Col>
          </Row>


          <Row>
            <h1>{t('client.rate.title')}</h1>
            <EditClientRate rate={client.rate} onChange={value => this.setState({...client, rate: value})} />

            <Col sm={4}>
              <Control.InvoiceDateStrategySelect
                value={client.defaultInvoiceDateStrategy}
                data-tst="defaultInvoiceDateStrategy"
                onChange={value => this.setState({...client, defaultInvoiceDateStrategy: value})}
              />
            </Col>

            <Col sm={4}>
              <PropertiesSelect
                label={t('client.extraInvoiceFields')}
                values={client.defaultExtraInvoiceFields || []}
                onChange={value => this.setState({...client, defaultExtraInvoiceFields: value})}
                data-tst="client.extraInvoiceFields"
              />
            </Col>
          </Row>


          <EditClientDefaultOther client={client} onChange={value => this.setState(value)} />


          <AttachmentsForm model={client} />


          <Row className="button-row">
            <Col>
              <BusyButton
                onClick={this._onSave.bind(this)}
                disabled={this.isClientDisabled(client)}
                data-tst="save"
              >
                {t('save')}
              </BusyButton>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }

  isClientDisabled(client: EditClientModel) {
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



const EditClientDefaultOther = ({client, onChange}) => (
  <div>
    <Row>
      <h1>{t('config.company.other')}</h1>
      <Col sm={4}>
        <StringInput
          label={t('invoice.fileName')}
          placeholder={t('invoice.fileNamePlaceHolder')}
          value={client.invoiceFileName}
          onChange={value => onChange({...client, invoiceFileName: value})}
          data-tst="client.invoiceFileName"
        />
      </Col>

      <Col sm={4}>
        <PropertiesSelect
          label={t('client.extraFields')}
          values={client.extraFields}
          onChange={value => onChange({...client, extraFields: value})}
          data-tst="client.extraFields"
        />
      </Col>
    </Row>
    <Row>
      <ExtraFieldsInput
        properties={client.extraFields}
        onChange={value => onChange({...client, extraFields: value})}
        data-tst="client.extraFields"
      />
    </Row>
  </div>
);
