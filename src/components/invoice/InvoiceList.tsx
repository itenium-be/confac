import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../actions/index';
import InvoiceListModel from './InvoiceListModel';
import {Container} from 'react-bootstrap';
import {InvoiceSearch} from './controls/InvoiceSearch';
import {GroupedInvoiceTable} from './invoice-table/GroupedInvoiceTable';
import {NonGroupedInvoiceTable} from './invoice-table/NonGroupedInvoiceTable';
import { ConfacState } from '../../reducers/default-states';
import { EditConfigModel } from '../config/EditConfigModel';
import EditInvoiceModel from './EditInvoiceModel';
import { EditClientModel } from '../client/ClientModels';
import { InvoiceFilters } from '../../models';


type InvoiceListProps = {
  config: EditConfigModel,
  invoices: EditInvoiceModel[],
  clients: EditClientModel[],
  updateInvoiceFilters: any,
  filters: InvoiceFilters,
}

export class InvoiceList extends Component<InvoiceListProps> {
  render() {
    if (!this.props.filters) {
      return null;
    }

    const isQuotation = window.location.pathname === '/quotations';
    const vm = new InvoiceListModel(this.props.invoices, this.props.clients, this.props.filters, isQuotation);

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

export default connect((state: ConfacState) => ({
  invoices: state.invoices.filter(x => !x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(InvoiceList);
