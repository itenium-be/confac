import React, { Component } from 'react';
import moment from 'moment';
import t from '../trans.js';

import DatePicker from 'react-bootstrap-date-picker';
import Select from 'react-select';

import { Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const tax = 21;
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
  name: 'Nexios IT',
  rate: {
    hourly: 65
  }
}];

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
      client: 2,
      number: 11,
      date: moment().endOf('month'),
      hours: 24,
    };
  }

  render() {
    return (
      <Grid>
        <Form>
          <Row className="show-grid">
            <Col md={4}>
              <FormGroup>
                <ControlLabel>{t('invoice.client')}</ControlLabel>
                <Select
                  name="form-field-name"
                  value={getDefaultClient()}
                  options={getClients()}
                  onChange={selectedKey => this.setState({client: selectedKey})}
                  clearable={false}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>{t('invoice.number')}</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.number}
                  placeholder={t('invoice.number')}
                  onChange={e => this.setState({number: e.target.value})}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <ControlLabel>{t('invoice.date')}</ControlLabel>
                <DatePicker
                  value={this.state.date ? this.state.date.toISOString() : undefined}
                  onChange={dateString => this.setState({date: dateString ? moment(dateString) : null})}
                  dateFormat="DD/MM/YYYY"
                  monthLabels={['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'October', 'November', 'December']}
                  dayLabels={['Zon', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Zat']}
                  placeholderText={t('invoice.date')}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}
