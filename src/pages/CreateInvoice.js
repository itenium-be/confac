import React, { Component } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import t from '../trans.js';

import DatePicker from 'react-bootstrap-date-picker';
import Select from 'react-select';
import { Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

const getDefaultClient = () => 2;

const clients = [{
  id: 1,
  name: '4D CAM BVBA',
  address: 'Beekveldstraat 67 bus1',
  city: '9300 Aalst',
  telephone: '054 / 80 45 03',
  btw: '0478.378.759',
  rate: {
    hourly: 50
  }
}, {
  id: 2,
  name: 'Nexios Consulting Group NV',
  address: 'Telecom Gardens – Medialaan 36',
  city: 'B-1800 Vilvoorde',
  btw: 'BE0478.895.136',
  rate: {
    hourly: 65
  }
}];

const ClientDetails = ({client}) => (
  <div>
    <h3>{client.name}</h3>
    <div>{client.address}</div>
    <div>{client.city}</div>
    <div>{client.telephone}</div>
    <div>{client.btw}</div>
    <div><strong>{t('client.hourlyRate')}: €{client.rate.hourly}</strong></div>
  </div>
)

function getClients() {
  return clients.map(client => ({value: client.id, label: client.name}));
}

export default class CreateInvoice extends Component {
  render() {
    return (
      <div>
        <CreatInvoiceForm />
      </div>
    );
  }
}

class CreatInvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: getDefaultClient(),
      number: 11,
      date: moment().endOf('month'),
      hours: 0,
    };
  }

  _createInvoice() {
    console.log('create', this.state);
  }

  render() {
    const client = clients.find(c => c.id === this.state.client);
    return (
      <Grid>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <ControlLabel>{t('invoice.client')}</ControlLabel>
                <Select
                  value={this.state.client}
                  options={getClients()}
                  onChange={selectedKey => this.setState({client: selectedKey})}
                  clearable={false}
                />
              </FormGroup>

              <ClientDetails client={client} />
            </Col>
            <Col md={6}>
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
          <Row>
            <Col md={4}>
              <h4>{t('invoice.totalTitle')}</h4>
              <InvoiceTotal client={client} amount={this.state.hours} />
            </Col>
          </Row>
          <Row style={{textAlign: 'center'}}>
            <Button bsSize="large" bsStyle="primary" onClick={this._createInvoice.bind(this)}>{t('invoice.create')}</Button>
          </Row>
        </Form>
      </Grid>
    );
  }
}

const InvoiceTotal = ({client, amount}) => {
  const totalWithoutTax = amount * client.rate.hourly;
  const taxPercentage = 21;
  const totalTax = totalWithoutTax / 100 * taxPercentage;
  const amountsStyle = {textAlign: 'right', float: 'right'};
  return (
    <div>
      <div>
        {t('invoice.subtotal')}
        <span style={amountsStyle}>€ {numeral(totalWithoutTax).format('0,0.00')}</span>
      </div>
      <div>
        {t('invoice.taxtotal', taxPercentage)}
        <span style={amountsStyle}>€ {numeral(totalTax).format('0,0.00')}</span>
      </div>
      <div>
        {t('invoice.total')}
        <span style={amountsStyle}><strong>€ {numeral(totalWithoutTax + totalTax).format('0,0.00')}</strong></span>
      </div>
    </div>
  );
}
