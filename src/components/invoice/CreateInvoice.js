import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { t } from '../util.js';

import { DatePicker, ClientSelect, NumericInput } from '../controls.js';
import { Grid, Row, Col, Form, Button } from 'react-bootstrap';
import ClientDetails from '../client/ClientDetails.js';
import CreateInvoiceLines from './CreateInvoiceLines.js';
import InvoiceTotal from './InvoiceTotal.js';
import { createInvoice, previewInvoice } from '../../actions/index.js';

class CreateInvoice extends Component {
  static propTypes = {
    config: PropTypes.shape({
      nextInvoiceNumber: PropTypes.number,
      defaultClient: PropTypes.string,
      company: PropTypes.object,
    }).isRequired,
    clients: PropTypes.array.isRequired,
    createInvoice: PropTypes.func.isRequired,
    previewInvoice: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    var client, lines;
    if (props.config.defaultClient) {
      client = this.props.clients.find(c => c._id === props.config.defaultClient);
      lines = [this.getClientLine(client)];
    }

    this.state = {
      number: props.config.nextInvoiceNumber || 1,
      date: moment().endOf('month'),
      client: client,
      lines: lines || [],
    };
  }

  getClientLine(client) {
    return {
      desc: client.rate.description,
      hours: 0,
      rate: client.rate.hourly,
    };
  }
  selectClient(client) {
    this.setState({
      client,
      lines: [this.getClientLine(client)]
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.client && nextProps.config.defaultClient) {
      const client = this.props.clients.find(c => c._id === nextProps.config.defaultClient);
      this.selectClient(client);
    }
    this.setState({number: nextProps.config.nextInvoiceNumber});
  }

  _createInvoice(type) {
    const extraInfos = {
      money: this._calculateMoneys(),
      your: this.props.config.company
    };
    const postBody = Object.assign({}, this.state, extraInfos);
    //console.log('post', postBody);

    if (type === 'create') {
      this.props.createInvoice(postBody);
    } else if (type === 'preview') {
      this.props.previewInvoice(postBody);
    }
  }

  _calculateMoneys() {
    const client = this.state.client;
    if (!client) {
      return {};
    }

    const totalWithoutTax = this.state.lines.reduce((prev, cur) => prev + cur.hours * cur.rate, 0);
    const taxPercentage = 21;
    const totalTax = totalWithoutTax / 100 * taxPercentage;
    return {
      totalWithoutTax,
      taxPercentage,
      totalTax,
      total: totalWithoutTax + totalTax,
    };
  }

  render() {
    const client = this.state.client;
    const money = this._calculateMoneys();
    return (
      <Grid>
        <Form>
          <Row>
            <Col sm={6}>
              <ClientSelect
                label={t('invoice.client')}
                value={this.state.client}
                onChange={this.selectClient.bind(this)}
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
                value={this.state.number}
                onChange={value => this.setState({number: value})}
              />

              <DatePicker
                label={t('invoice.date')}
                value={this.state.date}
                onChange={momentInstance => this.setState({date: momentInstance})}
              />
            </Col>
          </Row>
          <Row style={{marginTop: 8}}>
            <CreateInvoiceLines
              lines={this.state.lines}
              onChange={lines => this.setState({lines})}
            />
          </Row>
          <Row style={{textAlign: 'center', marginBottom: 8}}>
            <Button bsSize="large" bsStyle="default" onClick={this._createInvoice.bind(this, 'preview')} style={{marginRight: 14}}>
              {t('invoice.preview')}
            </Button>
            <Button bsSize="large" bsStyle="primary" onClick={this._createInvoice.bind(this, 'create')}>{t('invoice.create')}</Button>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({config: state.config, clients: state.clients}), {createInvoice, previewInvoice})(CreateInvoice);
