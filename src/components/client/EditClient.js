import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {t} from '../util.js';

import {BusyButton, StringInput, InputArray, AttachmentsForm, TextareaInput, PropertiesSelect, ExtraFieldsInput} from '../controls.js';
import {Grid, Row, Col, Form} from 'react-bootstrap';
import {saveClient} from '../../actions/index.js';
import {EditClientRate} from './controls/EditClientRate.js';

import {getNewClient, defaultClientProperties} from './EditClientViewModel.js';

class EditClient extends Component {
  static propTypes = {
    clients: PropTypes.array.isRequired,
    isLoaded: PropTypes.bool,
    saveClient: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string
    }),
  }
  constructor(props) {
    super(props);
    this.state = this.copyClient(props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoaded !== this.props.isLoaded
      || nextProps.params.id !== this.props.params.id
      || nextProps.clients !== this.props.clients) {

      this.setState({...this.copyClient(nextProps)});
    }
  }

  copyClient(props) {
    if (props.params.id) {
      // Existing client
      const client = props.clients.find(c => c.slug === props.params.id);
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
    const client = this.state;
    if (!client) {
      return <div />;
    }

    return (
      <Grid className="edit-container">
        <Form>
          <Row>
            <h1>{t('client.contact')}</h1>
            <h4>{t('createdOn')} {new Date(client.createdOn).toLocaleDateString()}</h4>
            <InputArray
              config={defaultClientProperties}
              model={client}
              onChange={value => this.setState({...client, ...value})}
              tPrefix="config.company."
            />
          </Row>


          <Row>
            <h1>{t('client.rate.title')}</h1>
            <EditClientRate rate={client.rate} onChange={value => this.setState({...client, rate: value})} />

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


          <AttachmentsForm client={client} />


          <Row className="button-row">
            <BusyButton
              onClick={this._onSave.bind(this)}
              disabled={this.isClientDisabled(client)}
              data-tst="save"
            >
              {t('save')}
            </BusyButton>
          </Row>
        </Form>
      </Grid>
    );
  }

  isClientDisabled(client) {
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

export default connect(state => ({
  clients: state.clients,
  isLoaded: state.app.isLoaded,
  config: state.config,
}), {saveClient})(EditClient);



const EditClientDefaultOther = ({client, onChange}) => (
  <div>
    <Row>
      <h1>{t('config.company.other')}</h1>
      <Col sm={4}>
        <TextareaInput
          label={t('notes')}
          placeholder={t('notes')}
          value={client.notes}
          onChange={value => onChange({...client, notes: value})}
          data-tst="client.notes"
        />
      </Col>
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
