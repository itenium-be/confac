import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../../actions/index';
import InvoiceListModel from '../models/InvoiceListModel';
import {Container, Row, Col} from 'react-bootstrap';
import {InvoiceSearch} from '../controls/InvoiceSearch';
import {GroupedInvoiceTable} from '../invoice-table/GroupedInvoiceTable';
import {NonGroupedInvoiceTable} from '../invoice-table/NonGroupedInvoiceTable';
import { ConfacState } from '../../../reducers/default-states';
import { EditConfigModel } from '../../config/EditConfigModel';
import EditInvoiceModel from '../models/EditInvoiceModel';
import { EditClientModel } from '../../client/ClientModels';
import { InvoiceFilters } from '../../../models';
import { t } from '../../util';


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
      <Container className="invoice-list">
        {!isQuotation && (
          <Row>
            <Col xs={12}>
              <h1>{t('title')}</h1>
            </Col>
          </Row>
        )}
        <InvoiceSearch
          onChange={(newFilter: InvoiceFilters) => this.props.updateInvoiceFilters(newFilter)}
          filterOptions={vm.getFilterOptions()}
          filters={this.props.filters}
          isQuotation={vm.isQuotation}
        />
        <TableComponent vm={vm} config={this.props.config} />
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
