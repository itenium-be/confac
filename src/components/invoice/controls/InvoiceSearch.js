import React, {Component, PropTypes} from 'react';
import {t} from '../../util.js';

import {Row, Col} from 'react-bootstrap';
import Select from 'react-select';
import {LabeledInput, Switch} from '../../controls/Inputs.js';

// The object returned by InvoiceListViewModel::getFilterOptions
const filterOptionsPropType = PropTypes.arrayOf(PropTypes.shape({
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['client', 'invoice_line', 'year', 'invoice-nr', 'manual_input']).isRequired,
})).isRequired;



export class InvoiceSearch extends Component {
  static propTypes = {
    filterOptions: filterOptionsPropType,
    filters: PropTypes.shape({
      search: PropTypes.array.isRequired,
      unverifiedOnly: PropTypes.bool.isRequired,
    }).isRequired,
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
            <InvoiceSearchSelect
              onChange={value => this.onFilterChange({search: value})}
              value={search}
              options={this.props.filterOptions}
            />
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



class InvoiceSearchSelect extends Component {
  static propTypes = {
    options: filterOptionsPropType,
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

    // All remaining are pure text searches
    value.filter(f => !f.type).forEach(f => {
      f.type = 'manual_input';
    });

    this.props.onChange(value);
  }

  render() {
    return (
      <Select.Creatable
        value={this.props.value}
        options={this.props.options}
        onChange={this.onChange.bind(this)}
        clearable
        multi
        clearValueText={t('controls.clearFilterValueText')}
        clearAllText={t('controls.clearAllFiltersText')}
        noResultsText={t('controls.noResultsText')}
        promptTextCreator={value => t('controls.addFilterText', {value})}
        placeholder={t('invoice.search.placeholder')}
      />
    );
  }
}
