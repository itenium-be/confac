import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Container} from 'react-bootstrap';

import * as Control from '../controls';
import {updateInvoiceFilters} from '../../actions/index';
import {InvoiceList} from '../invoice/InvoiceList';
import {t} from '../util';


export default class QuotationList extends Component {
  render() {
    return (
      <Container>
        <Control.AddIcon onClick="/quotation/create" label={t('quotation.createNew')} data-tst="new-quotation" />
        <ConnectedQuotationList />
      </Container>
    );
  }
}

const ConnectedQuotationList = connect(state => ({
  invoices: state.invoices.filter(x => x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(InvoiceList);
