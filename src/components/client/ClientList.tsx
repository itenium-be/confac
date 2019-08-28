import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';

import * as Control from '../controls';
import {Container, Table, Row, Col} from 'react-bootstrap';
import ClientListRow, {ClientListHeader} from './ClientListRow';
import {updateInvoiceFilters} from '../../actions/index';
import {getInvoiceYears} from '../invoice/InvoiceListModel';
import { EditClientModel } from './ClientModels';
import EditInvoiceModel from '../invoice/EditInvoiceModel';
import { ConfacState } from '../../reducers/default-states';

type ClientListProps = {
  invoices: EditInvoiceModel[],
  clients: EditClientModel[],
  updateInvoiceFilters: Function,
  filters: {
    clientListYears: number[]
  }
}

type ClientListState = {
  showDeleted: boolean,
}

class ClientList extends Component<ClientListProps, ClientListState> {
  constructor(props: any) {
    super(props);
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
      <Container className="client-list">
        <Row>
          <Col sm={3} xs={6}>
            <Control.AddIcon onClick="/client/create" label={t('client.createNew')} data-tst="new-client" />
          </Col>
          <Col sm={6} xs={6}>
            <Control.YearsSelect
              values={filters.clientListYears}
              years={getInvoiceYears(invoices)}
              onChange={(values: number[]) => this.props.updateInvoiceFilters({...filters, clientListYears: values || []})}
              data-tst="filter-years"
            />
          </Col>
          <Col sm={3} xs={12}>
            <Control.Switch
              checked={this.state.showDeleted}
              onChange={(checked: boolean) => this.setState({showDeleted: checked})}
              label={t('client.showInactive')}
              onColor="#F2DEDE"
            />
          </Col>
        </Row>


        <Table size="sm" style={{marginTop: 10}}>
          <ClientListHeader />
          <tbody>
            {clients.sort((a, b) => a.name.localeCompare(b.name)).map(client => (
              <ClientListRow client={client} key={client._id} invoices={filteredInvoices} />
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({
  clients: state.clients,
  invoices: state.invoices,
  filters: state.app.invoiceFilters,
}), {updateInvoiceFilters})(ClientList);
