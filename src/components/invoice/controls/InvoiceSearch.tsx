import React, {Component} from 'react';
import {t} from '../../util';
import {Row, Col} from 'react-bootstrap';
import {Switch} from '../../controls';
import { InvoiceFiltersSearch, InvoiceFilters } from '../../../models';
import { InvoiceSearchSelect } from './InvoiceSearchSelect';
import { SearchStringInput } from '../../controls/form-controls/inputs/SearchStringInput';


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
    const {search, unverifiedOnly, freeInvoice} = this.props.filters;
    return (
      <Row>
        <Col xl={3} md={4}>
          <SearchStringInput
            value={freeInvoice}
            onChange={str => this.onFilterChange({freeInvoice: str})}
          />
        </Col>
        <Col xl={3} md={4}>
          <InvoiceSearchSelect
            onChange={(value: InvoiceFiltersSearch[]) => this.onFilterChange({search: value})}
            value={search}
            options={this.props.filterOptions}
            data-tst="filter-all"
          />
        </Col>
        {!this.props.isQuotation ? (
          <Col xl={3} md={4}>
            <Switch
              checked={unverifiedOnly}
              onChange={(checked: boolean) => this.onFilterChange({unverifiedOnly: checked})}
              label={t('invoice.notVerifiedOnly')}
              data-tst="filter-unverified"
            />
          </Col>
        ) : null}
        <Col xl={{span: 3, offset: 0}} md={{span: 3, offset: 8}}>
          <Switch
            checked={this.props.filters.groupedByMonth}
            onChange={(checked: boolean) => this.onFilterChange({groupedByMonth: checked})}
            label={t('invoice.groupByMonth')}
            data-tst="filter-groupedByMonth"
          />
        </Col>
      </Row>
    );
  }
}
