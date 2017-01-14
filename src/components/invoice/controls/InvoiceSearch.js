import React, {Component, PropTypes } from 'react';
import {connect } from 'react-redux';
import moment from 'moment';
import {t } from '../../util.js';

import {Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import {LabeledInput, Switch } from '../../controls/Inputs.js';

class InvoiceSearchComponent extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    filters: PropTypes.shape({
      search: PropTypes.array.isRequired,
      unverifiedOnly: PropTypes.bool.isRequired,
    }),
    onChange: PropTypes.func.isRequired,
  }

  onFilterChange(updateObj) {
    const newFilter = Object.assign({}, this.props.filters, updateObj);
    this.props.onChange(newFilter);
  }

  render() {
    // WTF: pass any propname with a func to InvoiceSearchSelect and the grid icon column
    // breaks when this component is placed before the invoice list table
    const {search, unverifiedOnly} = this.props.filters;
    return (
      <Row>
        <Col sm={8}>
          <LabeledInput label={t('search')}>
            <InvoiceSearchSelect onChange={value => this.onFilterChange({search: value})} value={search} />
          </LabeledInput>
        </Col>
        <Col sm={4}>
          <Switch
            checked={unverifiedOnly}
            onChange={checked => this.onFilterChange({unverifiedOnly: checked})}
            label={t('invoice.notVerifiedOnly')}
            style={{marginTop: 28}}
          />
        </Col>
      </Row>
    );
  }
}





class InvoiceSearchSelectComponent extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
  }

  onChange(value) {
    // Consider pure int manual input
    // to be search on invoice number
    value.filter(f => !f.type && +f.value).forEach(f => {
      f.type = 'invoice-nr';
      f.value = parseInt(f.value, 10);
    });

    this.props.onChange(value);
  }

  render() {
    const {clients, invoices} = this.props;
    if (invoices.length === 0) {
      return <div />;
    }

    var options = [];
    options = options.concat(clients.map(client => ({value: client._id, label: client.name, type: 'client'})));

    const invoiceYears = getInvoiceYears(invoices);
    options = options.concat(invoiceYears.map(year => ({value: year, label: year, type: 'year'})));

    const lines = invoices.map(i => i.lines);
    const lineDescs = [].concat.apply([], lines).map(l => l.desc);
    const uniqueLines = lineDescs.filter((desc, index, arr) => arr.indexOf(desc) === index);
    options = options.concat(uniqueLines.map(lineDesc => ({value: lineDesc, label: lineDesc, type: 'invoice_line'})));

    return (
      <Select.Creatable
        value={this.props.value}
        options={options}
        onChange={this.onChange.bind(this)}
        clearable
        multi
        clearValueText={t('controls.clearValueText')}
        clearAllText={t('controls.clearAllText')}
        noResultsText={t('controls.noResultsText')}
        addLabelText={t('controls.addLabelText')}
        promptTextCreator={value => t('controls.addLabelText', {value})}
      />
    );
  }
}

export const InvoiceSearch = connect(state => ({invoices: state.invoices, clients: state.clients}))(InvoiceSearchComponent);
export const InvoiceSearchSelect = connect(state => ({invoices: state.invoices, clients: state.clients}))(InvoiceSearchSelectComponent);





function getInvoiceYears(invoices) {
  const dates = invoices.map(i => i.date.toDate());
  const firstInvoiceYear = moment(Math.min.apply(null, dates)).year();
  const lastInvoiceYear = moment(Math.max.apply(null, dates)).year();

  var years = [];
  for (let i = firstInvoiceYear; i <= lastInvoiceYear; i++) {
    years.push(i);
  }
  return years;
}
