import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {t} from '../../util.js';
import Creatable from 'react-select/creatable';
import {Row, Col} from 'react-bootstrap';
import {Switch} from '../../controls.js';
import {EnhanceInputWithLabel} from '../../enhancers/EnhanceInputWithLabel.js';

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
      groupedByMonth: PropTypes.bool.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    isQuotation: PropTypes.bool.isRequired,
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
        <Col sm={6}>
          <InvoiceSearchSelect
            label={t('search')}
            onChange={value => this.onFilterChange({search: value})}
            value={search}
            options={this.props.filterOptions}
            data-tst="filter-all"
          />
        </Col>
        {!this.props.isQuotation ? (
          <Col sm={3}>
            <Switch
              checked={unverifiedOnly}
              onChange={checked => this.onFilterChange({unverifiedOnly: checked})}
              label={t('invoice.notVerifiedOnly')}
              style={{marginTop: 28}}
              data-tst="filter-unverified"
            />
          </Col>
        ) : null}
        <Col sm={3}>
          <Switch
            checked={this.props.filters.groupedByMonth}
            onChange={checked => this.onFilterChange({groupedByMonth: checked})}
            label={t('invoice.groupByMonth')}
            style={{marginTop: 28}}
            data-tst="filter-groupedByMonth"
          />
        </Col>
      </Row>
    );
  }
}



const InvoiceSearchSelect = EnhanceInputWithLabel(class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    options: filterOptionsPropType,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
  }

  onChange(value) {
    if (value === null) {
      this.props.onChange([]);
      return;
    }

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
      <Creatable
        value={this.props.value}
        options={this.props.options}
        onChange={this.onChange.bind(this)}
        isClearable
        isMulti
        noOptionsMessage={() => t('controls.noResultsText')}
        formatCreateLabel={value => t('controls.addFilterText', {value})}
        placeholder={t('invoice.search.placeholder')}
        className={'tst-' + this.props['data-tst']}
      />
    );
  }
});
