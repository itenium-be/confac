import {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {SearchStringInput} from '../../controls/form-controls/inputs/SearchStringInput';
import {InvoiceSearchSelect} from '../controls/InvoiceSearchSelect';
import {InvoiceFiltersSearch, InvoiceListFilters} from '../../controls/table/table-models';


type QuotationSearchProps = {
  filterOptions: InvoiceFiltersSearch[];
  onChange: (newFilter: InvoiceListFilters) => void;
  filters: InvoiceListFilters;
}


export class QuotationSearch extends Component<QuotationSearchProps> {
  onFilterChange(updateObj: Partial<InvoiceListFilters>) {
    const newFilter: InvoiceListFilters = {...this.props.filters, ...updateObj};
    this.props.onChange(newFilter);
  }

  render() {
    const {search, freeInvoice} = this.props.filters;
    return (
      <Row>
        <Col sm={6}>
          <SearchStringInput
            value={freeInvoice}
            onChange={str => this.onFilterChange({freeInvoice: str})}
          />
        </Col>
        <Col sm={6}>
          <InvoiceSearchSelect
            onChange={(value: InvoiceFiltersSearch[]) => this.onFilterChange({search: value})}
            value={search}
            options={this.props.filterOptions}
          />
        </Col>
      </Row>
    );
  }
}
