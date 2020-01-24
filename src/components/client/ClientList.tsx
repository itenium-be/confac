import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Table, Row, Col} from 'react-bootstrap';
import {t} from '../utils';
import {updateInvoiceFilters, saveClient} from '../../actions/index';
import {getInvoiceYears} from '../invoice/models/InvoiceListModel';
import {ClientModel} from './models/ClientModels';
import InvoiceModel from '../invoice/models/InvoiceModel';
import {ConfacState} from '../../reducers/app-state';
import {SearchStringInput} from '../controls/form-controls/inputs/SearchStringInput';
import {InvoiceFilters} from '../../models';
import {searchClientFor} from './models/searchClientFor';
import {Switch} from '../controls/form-controls/Switch';
import {YearsSelect} from '../controls/form-controls/select/YearsSelect';
import {AddIcon} from '../controls/Icon';
import {clientFeature} from './models/getClientFeature';
import {List} from '../controls/table/List';
import {ListPage} from '../controls/table/ListPage';


type ClientListProps = {
  invoices: InvoiceModel[],
  clients: ClientModel[],
  updateInvoiceFilters: (filters: InvoiceFilters) => void,
  filters: InvoiceFilters,
  saveClient: (client: ClientModel, stayOnPage?: boolean, callback?: (client: ClientModel) => void) => void,
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

    let {clients} = this.props;
    if (!this.state.showDeleted) {
      clients = clients.filter(c => c.active);
    }
    if (filters.freeClient) {
      const freeTextFilter = filters.freeClient.toLowerCase();
      clients = clients.filter(c => searchClientFor(c, freeTextFilter));
    }

    let filteredInvoices = invoices;
    if (filters.clientListYears.length !== 0) {
      filteredInvoices = filteredInvoices.filter(i => filters.clientListYears.includes(i.date.year()));
    }

    const feature = clientFeature({
      clients,
      invoices: filteredInvoices,
      saveClient: this.props.saveClient,
    });

    return (
      <ListPage feature={feature} />
    );

    // return (
    //   <Container className="client-list">
    //     <h1>{t('nav.clients')}</h1>
    //     <Row>
    //       <Col lg={3} md={12}>
    //         <AddIcon onClick="/clients/create" label={t('client.createNew')} data-tst="new-client" />
    //       </Col>
    //       <Col lg={3} md={6}>
    //         <SearchStringInput
    //           value={filters.freeClient}
    //           onChange={str => this.props.updateInvoiceFilters({...filters, freeClient: str})}
    //         />
    //       </Col>
    //       <Col lg={3} md={6}>
    //         <YearsSelect
    //           values={filters.clientListYears}
    //           years={getInvoiceYears(invoices)}
    //           onChange={(values: number[]) => this.props.updateInvoiceFilters({...filters, clientListYears: values || []})}
    //           data-tst="filter-years"
    //         />
    //       </Col>
    //       <Col lg={3} md={12}>
    //         <Switch
    //           value={this.state.showDeleted}
    //           onChange={(checked: boolean) => this.setState({showDeleted: checked})}
    //           label={t('client.showInactive')}
    //           onColor="#F2DEDE"
    //         />
    //       </Col>
    //     </Row>


    //     <List feature={feature} />
    //   </Container>
    // );
  }
}

export default connect((state: ConfacState) => ({
  clients: state.clients,
  invoices: state.invoices,
  filters: state.app.invoiceFilters,
}), {updateInvoiceFilters, saveClient})(ClientList);
