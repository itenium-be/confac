import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../actions/index.js';
import InvoiceListViewModel from './InvoiceListViewModel.js';

import {Grid, Table} from 'react-bootstrap';
import InvoiceListRow, {InvoiceListHeader, InvoiceListFooter} from './InvoiceListRow.js';
import {InvoiceSearch} from './controls/InvoiceSearch.js';

class InvoiceList extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    updateInvoiceFilters: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      search: PropTypes.array.isRequired,
      unverifiedOnly: PropTypes.bool.isRequired,
    }),
  }

  render() {
    const {invoices, clients, filters} = this.props;
    const vm = new InvoiceListViewModel(invoices, clients, filters);
    const filteredInvoices = vm.getFilteredInvoices();
    const filterOptions = vm.getFilterOptions();
    return (
      <Grid>
        <Table condensed style={{marginTop: 10}}>
          <InvoiceListHeader />
          <tbody>
            {filteredInvoices.sort((a, b) => b.number - a.number).map(invoice => (
              <InvoiceListRow invoice={invoice} key={invoice._id} />
            ))}
          </tbody>
          <InvoiceListFooter invoices={filteredInvoices} />
        </Table>

        <InvoiceSearch
          onChange={newFilter => this.props.updateInvoiceFilters(newFilter)}
          filterOptions={filterOptions}
          filters={filters}
        />

      </Grid>
    );
  }
}

export default connect(state => ({
  invoices: state.invoices,
  clients: state.clients,
  filters: state.app.invoiceFilters
}), {updateInvoiceFilters})(InvoiceList);
