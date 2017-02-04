import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../actions/index.js';
import InvoiceListViewModel from './InvoiceListViewModel.js';
import t from '../../trans.js';

import {Grid, Table} from 'react-bootstrap';
import InvoiceListRow, {InvoiceListHeader, InvoiceListFooter} from './InvoiceListRow.js';
import {InvoiceSearch} from './controls/InvoiceSearch.js';

class InvoiceList extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
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

    var columns = [{
      header: t('invoice.numberShort'),
      value: invoice => invoice.number,
    }, {
      header: t('invoice.client'),
      value: invoice => invoice.client.name,
    }, {
      header: t('invoice.date'),
      value: invoice => invoice.date.format('DD/MM/YYYY'),
    }];

    if (this.props.config.showOrderNr) {
      columns.push({
        header: t('invoice.orderNrShort'),
        value: invoice => invoice.orderNr,
      });
    }

    return (
      <Grid>
        <Table condensed style={{marginTop: 10}}>
          <InvoiceListHeader columns={columns} />
          <tbody>
            {filteredInvoices.sort((a, b) => b.number - a.number).map(invoice => (
              <InvoiceListRow columns={columns} invoice={invoice} key={invoice._id} />
            ))}
          </tbody>
          <InvoiceListFooter columns={columns} invoices={filteredInvoices} />
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
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(InvoiceList);
