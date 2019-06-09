import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../actions/index.js';
import InvoiceListViewModel from './InvoiceListViewModel.js';

import {Grid} from 'react-bootstrap';
import {InvoiceSearch} from './controls/InvoiceSearch.js';
import {GroupedInvoiceTable} from './invoice-table/GroupedInvoiceTable.js';
import {NonGroupedInvoiceTable} from './invoice-table/NonGroupedInvoiceTable.js';
import {INVOICE_LIST_SHOW_CLIENT_DETAILS_EVENT} from "./InvoiceListRow";
import {ClientModal} from "../client/controls/ClientModal";


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


  constructor(props, context,) {
    super(props, context);
    this.state = {
      showClientDetailsModal: false,
      selectedInvoice: null,
    };
    this.onShowClientDetails = this.onShowClientDetails.bind(this);
    this.onConfirmClientChanges = this.onConfirmClientChanges.bind(this);
  }

  componentDidMount() {
    addEventListener(INVOICE_LIST_SHOW_CLIENT_DETAILS_EVENT, this.onShowClientDetails, true);
  }

  componentWillUnmount() {
    removeEventListener(INVOICE_LIST_SHOW_CLIENT_DETAILS_EVENT, this.onShowClientDetails, false);
  }

  onShowClientDetails(e) {
    e.preventDefault();
    e.stopPropagation();

    let selectedInvoice = this.props.invoices.find(inv => inv._id === e.detail.invoiceId);
    this.selectedInvoice = selectedInvoice;

    this.setState({
      showClientDetailsModal: true,
      selectedInvoice: selectedInvoice,
    })
  }

  onConfirmClientChanges(updatedClient){
    this.selectedInvoice.client = updatedClient;
    this.setState({showClientDetailsModal: false, selectedInvoice: null});
  }

  render() {
    const isQuotation = window.location.pathname === '/quotations';
    const vm = new InvoiceListViewModel(this.props.invoices, this.props.clients, this.props.filters, isQuotation);

    const TableComponent = this.props.filters.groupedByMonth ? GroupedInvoiceTable : NonGroupedInvoiceTable;
    return (
      <Grid>
        <TableComponent vm={vm} config={this.props.config} />
        <InvoiceSearch
          onChange={newFilter => this.props.updateInvoiceFilters(newFilter)}
          filterOptions={vm.getFilterOptions()}
          filters={this.props.filters}
          isQuotation={vm.isQuotation}
        />
        <ClientModal
          client={this.state.selectedInvoice ? this.state.selectedInvoice.client : null}
          show={this.state.showClientDetailsModal}
          onClose={() => this.setState({showClientDetailsModal: false, selectedInvoice: null})}
          onConfirm={this.onConfirmClientChanges}
        />
      </Grid>
    );
  }
}

export default connect(state => ({
  invoices: state.invoices.filter(x => !x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(InvoiceList);
