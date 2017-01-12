import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { t } from '../util.js';

import { AddIcon } from '../controls.js';
import { Grid, Table } from 'react-bootstrap';
import InvoiceListRow, { InvoiceListHeader, InvoiceListFooter } from './InvoiceListRow.js';

class InvoiceList extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
  }
  render() {
    return (
      <Grid>
        <AddIcon onClick="/invoice/create" label={t('nav.create')} />
        <Table condensed style={{marginTop: 10}}>
          <InvoiceListHeader />
          <tbody>
            {this.props.invoices.sort((a, b) => b.number - a.number).map(invoice => (
              <InvoiceListRow invoice={invoice} key={invoice._id} />
            ))}
          </tbody>
          <InvoiceListFooter invoices={this.props.invoices} />
        </Table>
      </Grid>
    );
  }
}

export default connect(state => ({invoices: state.invoices}), {})(InvoiceList);
