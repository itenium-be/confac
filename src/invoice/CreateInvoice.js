import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import t from '../trans.js';

import { DatePicker, ClientSelect, NumericInput } from '../controls/index.js';
import { Grid, Row, Col, Form, Button } from 'react-bootstrap';
import ClientDetails from '../client/ClientDetails.js';
import InvoiceTotal from './InvoiceTotal.js';
import { createInvoice, previewInvoice } from '../actions/index.js';

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

    var client = props.config.defaultClient;
    if (client) {
      client = this.props.clients.find(c => c._id === client);
    }

    this.state = {
      client,
      number: props.config.nextInvoiceNumber || 1,
      date: moment().endOf('month'),
      lines: [],
      hours: 0,
    };

    // if (client) {
    //   this.state.lines.push({
    //     desc: client.rate.description,
    //     hours: 0,
    //     rate: client.rate.hourly,
    //   });
    // }
  }
  // componentWillReceiveProps(nextProps) {
  //   if (!this.state.client) {
  //     this.setState({client: nextProps.config.defaultClient});
  //   }
  //   this.setState({number: nextProps.config.nextInvoiceNumber});
  // }

  _createInvoice(type) {
    const extraInfos = {
      money: this._calculateMoneys(),
      your: this.props.config.company
    };
    const postBody = Object.assign({}, this.state, extraInfos);
    console.log('post', postBody);

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

    const totalWithoutTax = this.state.hours * client.rate.hourly;
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
                onChange={item => this.setState({client: item})}
              />

              {client ? <ClientDetails client={client} /> : null}
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
          <Row>
            <NumericInput
              float
              label={t('invoice.hours')}
              value={this.state.hours}
              onChange={value => this.setState({hours: value})}
            />
          </Row>
          {client ? (
            <Row>
              <Col sm={4}>
                <h4>{t('invoice.totalTitle')}</h4>
                <InvoiceTotal {...money} />
              </Col>
            </Row>
          ) : null}
          <Row style={{textAlign: 'center'}}>
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
