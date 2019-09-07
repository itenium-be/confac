import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateInvoiceFilters} from '../../../actions/index';
import InvoiceListModel from '../models/InvoiceListModel';
import {Container, Row, Col} from 'react-bootstrap';
import {GroupedInvoiceTable} from '../invoice-table/GroupedInvoiceTable';
import {NonGroupedInvoiceTable} from '../invoice-table/NonGroupedInvoiceTable';
import { ConfacState } from '../../../reducers/app-state';
import { ConfigModel } from '../../config/models/ConfigModel';
import InvoiceModel from '../models/InvoiceModel';
import { ClientModel } from '../../client/models/ClientModels';
import { InvoiceFilters } from '../../../models';
import { t } from '../../util';
import { QuotationSearch } from './QuotationSearch';
import { Link } from 'react-router-dom';
import { Icon } from '../../controls';


type QuotationListProps = {
  config: ConfigModel,
  invoices: InvoiceModel[],
  clients: ClientModel[],
  updateInvoiceFilters: any,
  filters: InvoiceFilters,
}

export class QuotationList extends Component<QuotationListProps> {
  render() {
    if (!this.props.filters) {
      return null;
    }

    const vm = new InvoiceListModel(this.props.invoices, this.props.clients, this.props.filters, true);

    const TableComponent = this.props.filters.groupedByMonth ? GroupedInvoiceTable : NonGroupedInvoiceTable;
    return (
      <Container className="quotation-list">
        <Row>
          <Col xs={8}>
              <h1>{t('quotation.title')}</h1>
            </Col>
            <Col xs={4} style={{textAlign: 'right'}}>
              <Link to="/invoices" className="btn btn-light">
                {t('title')}
                <Icon fa="fa fa-arrow-right" size={1} style={{marginLeft: 8}} />
              </Link>
            </Col>
        </Row>
        <QuotationSearch
          onChange={(newFilter: InvoiceFilters) => this.props.updateInvoiceFilters(newFilter)}
          filterOptions={vm.getFilterOptions()}
          filters={this.props.filters}
        />
        <TableComponent vm={vm} config={this.props.config} />
      </Container>
    );
  }
}

export default connect((state: ConfacState) => ({
  invoices: state.invoices.filter(x => x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(QuotationList);
