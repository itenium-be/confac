import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t, InvoiceModel } from '../util.js';

import { DatePicker, ClientSelect, NumericInput, StringInput, BusyButton } from '../controls.js';
import { Grid, Row, Col, Form } from 'react-bootstrap';
import ClientDetails from '../client/ClientDetails.js';
import EditInvoiceLines from './EditInvoiceLines.js';
import InvoiceTotal from './InvoiceTotal.js';
import { createInvoice, previewInvoice, updateInvoice } from '../../actions/index.js';

class EditInvoice extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    config: PropTypes.shape({
      nextInvoiceNumber: PropTypes.number,
      defaultClient: PropTypes.string,
      company: PropTypes.object,
    }).isRequired,
    app: PropTypes.shape({
      isLoaded: PropTypes.bool,
    }).isRequired,
    clients: PropTypes.array.isRequired,
    createInvoice: PropTypes.func.isRequired,
    previewInvoice: PropTypes.func.isRequired,
    updateInvoice: PropTypes.func.isRequired,
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
      return new InvoiceModel(props.config, props.invoices.find(invoice => invoice._id === props.params.id));

    } else {
      // New invoice
      var client;
      if (props.config.defaultClient) {
        client = props.clients.find(c => c._id === props.config.defaultClient);
      }
      return InvoiceModel.createNew(props.config, client);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.app.isLoaded !== this.props.app.isLoaded || nextProps.params.id !== this.props.params.id) {
      this.setState({invoice: this.createModel(nextProps)});
    }
  }

  _createInvoice(type) {
    if (type === 'create') {
      this.props.createInvoice(this.state.invoice);
    } else if (type === 'preview') {
      this.props.previewInvoice(this.state.invoice);
    } else if (type === 'update') {
      this.props.updateInvoice(this.state.invoice);
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
          <Row style={{textAlign: 'center', marginBottom: 8}}>
            <SaveButtons onClick={this._createInvoice.bind(this)} isNewInvoice={model.isNew} />
          </Row>
        </Form>
      </Grid>
    );
  }
}

const SaveButtons = ({isNewInvoice, onClick}) => {
  if (isNewInvoice) {
    return (
      <div>
        <BusyButton bsStyle="default" onClick={onClick.bind(this, 'preview')} style={{marginRight: 14}}>
          {t('invoice.preview')}
        </BusyButton>
        <BusyButton onClick={onClick.bind(this, 'create')}>{t('invoice.create')}</BusyButton>
      </div>
    );
  }
  return <BusyButton onClick={onClick.bind(this, 'update')}>{t('save')}</BusyButton>;
};


export default connect(state => ({
  config: state.config,
  app: state.app,
  clients: state.clients,
  invoices: state.invoices,
}), {createInvoice, previewInvoice, updateInvoice})(EditInvoice);
