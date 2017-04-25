import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {t} from '../util.js';

import * as Control from '../controls.js';
import {Grid, Table, Row, Col} from 'react-bootstrap';
import ClientListRow, {ClientListHeader} from './ClientListRow.js';
import {updateInvoiceFilters} from '../../actions/index.js';
import {getInvoiceYears} from '../invoice/InvoiceListViewModel.js';

class ClientList extends Component {
  static propTypes = {
    invoices: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    updateInvoiceFilters: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      clientListYears: PropTypes.array.isRequired,
    }).isRequired,
  }
  constructor() {
    super();
    this.state = {showDeleted: false};
  }

  render() {
    var clients = this.props.clients;
    if (!this.state.showDeleted) {
      clients = clients.filter(c => c.active);
    }

    const {invoices, filters} = this.props;

    var filteredInvoices = invoices;
    if (filters.clientListYears.length !== 0) {
      filteredInvoices = invoices.filter(i => filters.clientListYears.includes(i.date.year()));
    }

    return (
      <Grid>
        <Control.AddIcon onClick="/client/create" label={t('client.createNew')} data-tst="new-client" />

        <div className="pull-right" style={{width: 220}}>
          <Control.Switch
            checked={this.state.showDeleted}
            onChange={checked => this.setState({showDeleted: checked})}
            label={t('client.showInactive')}
            onColor="#F2DEDE"
          />
        </div>

        <Table condensed style={{marginTop: 10}}>
          <ClientListHeader />
          <tbody>
            {clients.sort((a, b) => a.name.localeCompare(b.name)).map(client => (
              <ClientListRow client={client} key={client._id} invoices={filteredInvoices} />
            ))}
          </tbody>
        </Table>

        <Row>
          <Col sm={6}>
            <Control.YearsSelect
              label={t('client.yearsFilter')}
              values={filters.clientListYears}
              years={getInvoiceYears(invoices)}
              onChange={values => this.props.updateInvoiceFilters({...filters, clientListYears: values})}
              data-tst="filter-years"
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default connect(state => ({
  clients: state.clients,
  invoices: state.invoices,
  filters: state.app.invoiceFilters,
}), {updateInvoiceFilters})(ClientList);
