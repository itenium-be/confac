import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t } from '../util.js';

import { AddIcon } from '../controls.js';
import { Grid, Table } from 'react-bootstrap';
import InvoiceListRow from './InvoiceListRow.js';

class InvoiceList extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
  }
  render() {
    return (
      <Grid>
        <AddIcon onClick="/invoice/create" label={t('nav.create')} />
        <Table condensed>
          <thead>
            <tr>
              <th>{t('invoice.numberShort')}</th>
              <th>{t('invoice.client')}</th>
              <th>{t('invoice.date')}</th>
              <th>{t('invoice.hoursShort')}</th>
              <th width="10%">{t('invoice.totalTitle')}</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.props.invoices.map(invoice => <InvoiceListRow invoice={invoice} key={invoice._id} />)}
          </tbody>
        </Table>
      </Grid>
    );
  }
}

export default connect(state => ({invoices: state.invoices}), {})(InvoiceList);
