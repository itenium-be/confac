import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../actions/index.js';
import InvoiceListViewModel from './InvoiceListViewModel.js';
import {Container} from 'react-bootstrap';
import {InvoiceSearch} from './controls/InvoiceSearch.js';
import {GroupedInvoiceTable} from './invoice-table/GroupedInvoiceTable.js';
import {NonGroupedInvoiceTable} from './invoice-table/NonGroupedInvoiceTable.js';


export class InvoiceList extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    invoices: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    updateInvoiceFilters: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      search: PropTypes.array.isRequired,
      unverifiedOnly: PropTypes.bool.isRequired,
      groupedByMonth: PropTypes.bool.isRequired,
    }),
  };

  render() {
    const isQuotation = window.location.pathname === '/quotations';
    const vm = new InvoiceListViewModel(this.props.invoices, this.props.clients, this.props.filters, isQuotation);

    const TableComponent = this.props.filters.groupedByMonth ? GroupedInvoiceTable : NonGroupedInvoiceTable;
    return (
      <Container>
        <TableComponent vm={vm} config={this.props.config} />
        <InvoiceSearch
          onChange={newFilter => this.props.updateInvoiceFilters(newFilter)}
          filterOptions={vm.getFilterOptions()}
          filters={this.props.filters}
          isQuotation={vm.isQuotation}
        />
      </Container>
    );
  }
}

export default connect(state => ({
  invoices: state.invoices.filter(x => !x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(InvoiceList);
