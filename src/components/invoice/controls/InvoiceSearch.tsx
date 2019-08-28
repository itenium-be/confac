import React, {Component} from 'react';
import {t} from '../../util';
import {Row, Col} from 'react-bootstrap';
import {Switch} from '../../controls';
import { InvoiceFiltersSearch, InvoiceFilters } from '../../../models';
import { InvoiceSearchSelect } from './InvoiceSearchSelect';


type InvoiceSearchProps = {
  filterOptions: InvoiceFiltersSearch[],
  onChange: (newFilter: InvoiceFilters) => void,
  isQuotation: boolean,
  filters: InvoiceFilters,
}


export class InvoiceSearch extends Component<InvoiceSearchProps> {
  onFilterChange(updateObj: any) {
    const newFilter: InvoiceFilters = Object.assign({}, this.props.filters, updateObj);
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
            onChange={(value: InvoiceFiltersSearch[]) => this.onFilterChange({search: value})}
            value={search}
            options={this.props.filterOptions}
            data-tst="filter-all"
          />
        </Col>
        {!this.props.isQuotation ? (
          <Col sm={3}>
            <Switch
              checked={unverifiedOnly}
              onChange={(checked: boolean) => this.onFilterChange({unverifiedOnly: checked})}
              label={t('invoice.notVerifiedOnly')}
              style={{marginTop: 28}}
              data-tst="filter-unverified"
            />
          </Col>
        ) : null}
        <Col sm={3}>
          <Switch
            checked={this.props.filters.groupedByMonth}
            onChange={(checked: boolean) => this.onFilterChange({groupedByMonth: checked})}
            label={t('invoice.groupByMonth')}
            style={{marginTop: 28}}
            data-tst="filter-groupedByMonth"
          />
        </Col>
      </Row>
    );
  }
}
