import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t, InvoiceModel} from '../util.js';

import {DatePicker, ClientSelect, NumericInput, StringInput, AttachmentsForm} from '../controls.js';
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
      return new InvoiceModel(props.config, invoice);

    } else {
      // New invoice
      var client;
      if (props.config.defaultClient) {
        client = props.clients.find(c => c._id === props.config.defaultClient);
      }
      var model = InvoiceModel.createNew(props.config, client);
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

  render() {
    const model = this.state.invoice;
    const client = this.state.invoice.client;
    const money = this.state.invoice.money;
    return (
      <Grid>
        <Form>
          <Row>
            <InvoiceNotVerifiedAlert invoice={model} />
            <Col sm={6}>
              <ClientSelect
                label={t('invoice.client')}
                value={client}
                onChange={c => this.setState({model: model.setClient(c)})}
              />

              {client ? (
                <Row>
                  <Col sm={6}>
                    <ClientDetails client={client} />
                  </Col>
                  <Col sm={6}>
                    <h4>{t('invoice.totalTitle')}</h4>
                    <InvoiceTotal {...money} />
                  </Col>
                </Row>
              ) : null}
            </Col>
            <Col sm={6}>
              <NumericInput
                label={t('invoice.number')}
                value={model.number}
                onChange={value => this.setState({model: model.setNumber(value)})}
              />

              <DatePicker
                label={t('invoice.date')}
                value={model.date}
                onChange={momentInstance => this.setState({model: model.setDate(momentInstance)})}
              />

              <StringInput
                label={t('invoice.orderNr')}
                value={model.orderNr}
                onChange={value => this.setState({model: model.setOrderNr(value)})}
              />
            </Col>
          </Row>
          <Row style={{marginTop: 8}}>
            <EditInvoiceLines
              invoice={model}
              onChange={m => this.setState({model: m})}
            />
          </Row>
          <div style={{marginTop: -20}}>
            <AttachmentsForm invoice={model} />
          </div>
          <Row style={{marginBottom: 8}}>
            <EditInvoiceSaveButtons onClick={this.props.invoiceAction.bind(this, this.state.invoice)} isNewInvoice={model.isNew} />
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
