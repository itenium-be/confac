import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t, EditInvoiceViewModel} from '../util.js';

import {DatePicker, ClientSelect, NumericInput, StringInput, AttachmentsForm, ExtraFieldsInput, PropertiesSelect, HeaderWithEditIcon} from '../controls.js';
import {Grid, Row, Col, Form} from 'react-bootstrap';
import ClientDetails from '../client/controls/ClientDetails.js';
import EditInvoiceLines from './EditInvoiceLines.js';
import InvoiceNotVerifiedAlert from './controls/InvoiceNotVerifiedAlert.js';
import {EditInvoiceSaveButtons} from './controls/EditInvoiceSaveButtons.js';
import InvoiceTotal from './controls/InvoiceTotal.js';
import {invoiceAction} from '../../actions/index.js';

class EditInvoice extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    config: PropTypes.shape({
      defaultClient: PropTypes.string,
      company: PropTypes.object,
    }).isRequired,
    app: PropTypes.shape({
      isLoaded: PropTypes.bool,
    }).isRequired,
    clients: PropTypes.array.isRequired,
    invoiceAction: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string
    }),
  }
  constructor(props) {
    super(props);
    this.state = {invoice: this.createModel(props)};
  }

  createModel(props) {
    if (props.params.id) {
      // Existing invoice
      const invoice = props.invoices.find(i => i.number === parseInt(props.params.id, 10));
      return new EditInvoiceViewModel(props.config, invoice);

    } else {
      // New invoice
      var client;
      if (props.config.defaultClient) {
        client = props.clients.find(c => c._id === props.config.defaultClient);
      }
      var model = EditInvoiceViewModel.createNew(props.config, client);
      model.number = props.invoices.map(i => i.number).reduce((a, b) => Math.max(a, b), 0) + 1;
      return model;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.isLoaded !== this.props.app.isLoaded
      || nextProps.params.id !== this.props.params.id
      || nextProps.invoices !== this.props.invoices) {

      this.setState({invoice: this.createModel(nextProps)});
    }
  }

  updateInvoice(key, value) {
    // Naughty naughty: We are manipulating state directly!
    // To fix this: state should be a regular object, and a
    // EditInvoiceViewModel should be created in the render
    this.state.invoice.updateField(key, value);
    this.forceUpdate();
  }

  render() {
    const {invoice} = this.state;
    const {client, money} = invoice;
    return (
      <Grid>
        <Form>
          <Row>
            <InvoiceNotVerifiedAlert invoice={invoice} />
            <Col sm={6}>
              <ClientSelect
                label={t('invoice.client')}
                value={client}
                onChange={c => this.setState({invoice: invoice.setClient(c)})}
              />

              {client ? (
                <Row>
                  <Col xs={6}>
                    <ClientDetails client={client} />
                  </Col>
                  <Col xs={6}>
                    <h4>{t('invoice.totalTitle')}</h4>
                    <InvoiceTotal {...money} />
                  </Col>
                </Row>
              ) : null}
            </Col>
            <Col sm={6}>
              <div className="split">
                <NumericInput
                  label={t('invoice.number')}
                  value={invoice.number}
                  onChange={this.updateInvoice.bind(this, 'number')}
                />

                <DatePicker
                  label={t('invoice.date')}
                  value={invoice.date}
                  onChange={this.updateInvoice.bind(this, 'date')}
                />
              </div>
            </Col>


            <Col sm={6}>
              <div className="split">
                <StringInput
                  label={t('invoice.fileName')}
                  value={invoice.fileName}
                  onChange={this.updateInvoice.bind(this, 'fileName')}
                />

                <StringInput
                  label={t('invoice.orderNr')}
                  value={invoice.orderNr}
                  onChange={this.updateInvoice.bind(this, 'orderNr')}
                />
              </div>
            </Col>
          </Row>

          <EditInvoiceExtraFields
            invoice={invoice}
            onChange={this.updateInvoice.bind(this, 'extraFields')}
          />

          <Row style={{marginTop: 8}}>
            <EditInvoiceLines
              invoice={invoice}
              onChange={m => this.setState({invoice: m})}
            />
          </Row>
          <div style={{marginTop: -20}}>
            <AttachmentsForm invoice={invoice} />
          </div>
          <Row style={{marginBottom: 8}}>
            <EditInvoiceSaveButtons onClick={this.props.invoiceAction.bind(this, invoice)} isNewInvoice={invoice.isNew} />
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({
  config: state.config,
  app: state.app,
  clients: state.clients,
  invoices: state.invoices,
}), {invoiceAction})(EditInvoice);




class EditInvoiceExtraFields extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {extraFieldFormOpen: false};
  }

  render() {
    const {invoice, onChange} = this.props;

    if (invoice.extraFields.length === 0) {
      return <div />;
    }

    return (
      <div>
        <Row>
          <HeaderWithEditIcon
            label={t('extraFields')}
            onEditClick={() => this.setState({extraFieldFormOpen: !this.state.extraFieldFormOpen})}
          />
          {this.state.extraFieldFormOpen ? (
            <Col sm={4} style={{height: 75}}>
              <PropertiesSelect
                label={t('invoice.editExtraFields')}
                values={invoice.extraFields}
                onChange={onChange}
              />
            </Col>
          ) : null}
        </Row>

        {invoice.extraFields.length ? (
          <Row>
            <ExtraFieldsInput
              properties={invoice.extraFields}
              onChange={onChange}
            />
          </Row>
        ) : null}
      </div>
    );
  }
}
