import React, {Component} from 'react';
import {connect} from 'react-redux';
import {t} from '../util';
import * as Control from '../controls';
import {Container, Table, Row, Col} from 'react-bootstrap';
import ClientListRow, {ClientListHeader} from './ClientListRow';
import {updateInvoiceFilters} from '../../actions/index';
import {getInvoiceYears} from '../invoice/models/InvoiceListModel';
import { ClientModel } from './models/ClientModels';
import InvoiceModel from '../invoice/models/InvoiceModel';
import { ConfacState } from '../../reducers/app-state';
import { SearchStringInput } from '../controls/form-controls/inputs/SearchStringInput';
import { InvoiceFilters } from '../../models';
import { searchClientFor } from "./models/searchClientFor";

type ClientListProps = {
  invoices: InvoiceModel[],
  clients: ClientModel[],
  updateInvoiceFilters: (filters: InvoiceFilters) => void,
  filters: InvoiceFilters,
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
    const {invoices, filters} = this.props;

    var clients = this.props.clients;
    if (!this.state.showDeleted) {
      clients = clients.filter(c => c.active);
    }
    if (filters.freeClient) {
      const freeTextFilter = filters.freeClient.toLowerCase();
      clients = clients.filter(c => searchClientFor(c, freeTextFilter));
    }

    var filteredInvoices = invoices;
    if (filters.clientListYears.length !== 0) {
      filteredInvoices = filteredInvoices.filter(i => filters.clientListYears.includes(i.date.year()));
    }

    return (
      <Container className="client-list">
        <h1>{t('nav.clients')}</h1>
        <Row>
          <Col lg={3} md={12}>
            <Control.AddIcon onClick="/clients/create" label={t('client.createNew')} data-tst="new-client" />
          </Col>
          <Col lg={3} md={6}>
            <SearchStringInput
              value={filters.freeClient}
              onChange={str => this.props.updateInvoiceFilters({...filters, freeClient: str})}
            />
          </Col>
          <Col lg={3} md={6}>
            <Control.YearsSelect
              values={filters.clientListYears}
              years={getInvoiceYears(invoices)}
              onChange={(values: number[]) => this.props.updateInvoiceFilters({...filters, clientListYears: values || []})}
              data-tst="filter-years"
            />
          </Col>
          <Col lg={3} md={12}>
            <Control.Switch
              value={this.state.showDeleted}
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
