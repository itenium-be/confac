import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import t from '../trans.js';

import DatePicker from 'react-bootstrap-date-picker';
import Select from 'react-select';
import { Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import ClientDetails from '../client/ClientDetails.js';
import InvoiceTotal from './InvoiceTotal.js';
import { createInvoice } from '../actions.js';

class CreateInvoice extends Component {
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
    if (this.props.config.defaultClient === undefined && nextProps.config.defaultClient) {
      this.setState({client: nextProps.config.defaultClient, number: nextProps.config.nextInvoiceNumber});
    }
  }

  _createInvoice() {
    this.props.createInvoice(Object.assign({}, this.state, {client: this._getClientDetails(), money: this._calculateMoneys()}));
  }

  _getClients() {
    return this.props.clients.map(client => ({value: client.id, label: client.name}));
  }
  _getClientDetails() {
    return this.props.clients.find(c => c.id === this.state.client);
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
                <Select
                  value={this.state.client}
                  options={this._getClients()}
                  onChange={selectedKey => this.setState({client: selectedKey})}
                  clearable={false}
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
                  value={this.state.date ? this.state.date.toISOString() : undefined}
                  onChange={dateString => this.setState({date: dateString ? moment(dateString) : null})}
                  dateFormat="DD/MM/YYYY"
                  monthLabels={['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'December']}
                  dayLabels={['Zon', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Zat']}
                />
              </FormGroup>

              <FormGroup>
                <ControlLabel>{t('invoice.hours')}</ControlLabel>
                <FormControl
                  type="number"
                  value={this.state.hours}
                  placeholder={t('invoice.hours')}
                  onChange={e => this.setState({hours: parseInt(e.target.value, 10)})}
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
            <Button bsSize="large" bsStyle="primary" onClick={this._createInvoice.bind(this)}>{t('invoice.create')}</Button>
          </Row>
        </Form>
      </Grid>
    );
  }
}

export default connect(state => ({config: state.config, clients: state.clients}), {createInvoice})(CreateInvoice);
