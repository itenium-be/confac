import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import t from '../trans.js';

import { DatePicker, ClientSelect } from '../controls/index.js';
import { Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
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
    this.state = {
      client: props.config.defaultClient,
      number: props.config.nextInvoiceNumber || 1,
      date: moment().endOf('month'),
      hours: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.client) {
      this.setState({client: nextProps.config.defaultClient});
    }
    this.setState({number: nextProps.config.nextInvoiceNumber});
  }

  _createInvoice(type) {
    const extraInfos = {
      client: this._getClientDetails(),
      money: this._calculateMoneys(),
      your: this.props.config.company
    };
    const postBody = Object.assign({}, this.state, extraInfos);

    if (type === 'create') {
      this.props.createInvoice(postBody);
    } else if (type === 'preview') {
      this.props.previewInvoice(postBody);
    }
  }

  _getClientDetails() {
    return this.props.clients.find(c => c._id === this.state.client);
  }
  _calculateMoneys() {
    const client = this._getClientDetails();
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
    const client = this._getClientDetails();
    const money = this._calculateMoneys();
    return (
      <Grid>
        <Form>
          <Row>
            <Col sm={6}>
              <FormGroup>
                <ControlLabel>{t('invoice.client')}</ControlLabel>
                <ClientSelect
                  value={this.state.client}
                  onChange={item => this.setState({client: item._id})}
                />
              </FormGroup>

              {client ? <ClientDetails client={client} /> : null}
            </Col>
            <Col sm={6}>
              <FormGroup>
                <ControlLabel>{t('invoice.number')}</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.number}
                  placeholder={t('invoice.number')}
                  onChange={e => this.setState({number: parseInt(e.target.value, 10)})}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>{t('invoice.date')}</ControlLabel>
                <DatePicker
                  value={this.state.date}
                  onChange={momentInstance => this.setState({date: momentInstance})}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>{t('invoice.hours')}</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.hours}
                  placeholder={t('invoice.hours')}
                  onChange={e => this.setState({hours: parseFloat(e.target.value, 10)})}
                />
              </FormGroup>
            </Col>
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
