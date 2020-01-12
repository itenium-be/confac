import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {InvoiceFiltersSearch, InvoiceFilters} from '../../../models';
import {SearchStringInput} from '../../controls/form-controls/inputs/SearchStringInput';
import {InvoiceSearchSelect} from '../controls/InvoiceSearchSelect';


type QuotationSearchProps = {
  filterOptions: InvoiceFiltersSearch[],
  onChange: (newFilter: InvoiceFilters) => void,
  filters: InvoiceFilters,
}


export class QuotationSearch extends Component<QuotationSearchProps> {
  onFilterChange(updateObj: any) {
    const newFilter: InvoiceFilters = {...this.props.filters, ...updateObj};
    this.props.onChange(newFilter);
  }

  render() {
    const {search, freeInvoice} = this.props.filters;
    return (
      <Row>
        <Col sm={6}>
          <SearchStringInput
            value={freeInvoice}
            onChange={(str) => this.onFilterChange({freeInvoice: str})}
          />
        </Col>
        <Col sm={6}>
          <InvoiceSearchSelect
            onChange={(value: InvoiceFiltersSearch[]) => this.onFilterChange({search: value})}
            value={search}
            options={this.props.filterOptions}
            data-tst="filter-all"
          />
        </Col>
      </Row>
    );
  }
}
