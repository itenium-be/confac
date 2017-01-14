import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t, getNumeric } from '../util.js';

import { AddIcon } from '../controls.js';
import { Grid, Table } from 'react-bootstrap';
import InvoiceListRow, { InvoiceListHeader, InvoiceListFooter } from './InvoiceListRow.js';
import { InvoiceSearch } from './controls/InvoiceSearch.js';
import { updateInvoiceFilters } from '../../actions/index.js';

function searchInvoiceFor(invoice, text) {
  text = text.toLowerCase();

  if (invoice.orderNr.toLowerCase().includes(text)) {
    return true;
  }

  const client = invoice.client;
  if (client.city.toLowerCase().includes(text) || client.address.toLowerCase().includes(text)) {
    return true;
  }

  const numericText = getNumeric(text);
  if (numericText) {
    const numericBtw = getNumeric(client.btw);
    const numericTelephone = getNumeric(client.telephone);
    if (numericText === numericBtw || numericText === numericTelephone) {
      return true;
    }
  }

  return false;
}

class InvoiceList extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    updateInvoiceFilters: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      search: PropTypes.array.isRequired,
      unverifiedOnly: PropTypes.bool.isRequired,
    }),
  }

  render() {
    const invoices = filterInvoices(this.props.invoices, this.props.filters);
    return (
      <Grid>
        <AddIcon onClick="/invoice/create" label={t('nav.create')} />
        <Table condensed style={{marginTop: 10}}>
          <InvoiceListHeader />
          <tbody>
            {invoices.sort((a, b) => b.number - a.number).map(invoice => (
              <InvoiceListRow invoice={invoice} key={invoice._id} />
            ))}
          </tbody>
          <InvoiceListFooter invoices={invoices} />
        </Table>


        <InvoiceSearch onChange={filters => this.props.updateInvoiceFilters(filters)} filters={this.props.filters} />


      </Grid>
    );
  }
}

function filterInvoices(invoices, filters) {
  const {search, unverifiedOnly} = filters;

  const directInvoiceNrSearches = search.filter(f => f.type === 'invoice-nr').map(f => f.value);
  if (directInvoiceNrSearches.length) {
    return invoices.filter(i => directInvoiceNrSearches.includes(i.number));
  }



  if (unverifiedOnly) {
    invoices = invoices.filter(i => !i.verified);
  }



  if (search.length) {
    const yearFilters = search.filter(f => f.type === 'year').map(f => f.value);
    if (yearFilters.length) {
      invoices = invoices.filter(i => yearFilters.includes(i.date.year()));
    }

    const clientFilters = search.filter(f => f.type === 'client').map(f => f.value);
    if (clientFilters.length) {
      invoices = invoices.filter(i => clientFilters.includes(i.client._id));
    }

    const invoiceLineDescFilters = search.filter(f => f.type === 'invoice_line').map(f => f.value);
    if (invoiceLineDescFilters.length) {
      invoices = invoices.filter(i => invoiceLineDescFilters.some(descFilter => i.lines.map(l => l.desc).includes(descFilter)));
    }

    const otherFilters = search.filter(f => !f.type).map(f => f.value);
    otherFilters.forEach(otherFilter => {
      invoices = invoices.filter(i => searchInvoiceFor(i, otherFilter));
    });
  }

  return invoices;
}


export default connect(state => ({invoices: state.invoices, filters: state.app.invoiceFilters}), {updateInvoiceFilters})(InvoiceList);
