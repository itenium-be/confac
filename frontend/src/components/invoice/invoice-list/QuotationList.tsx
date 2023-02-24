import React from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {updateInvoiceFilters} from '../../../actions/index';
import InvoiceListModel from '../models/InvoiceListModel';
import {GroupedInvoiceTable} from '../invoice-table/GroupedInvoiceTable';
import {NonGroupedInvoiceTable} from '../invoice-table/NonGroupedInvoiceTable';
import {ConfacState} from '../../../reducers/app-state';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceModel from '../models/InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {InvoiceFilters} from '../../../models';
import {t} from '../../utils';
import {QuotationSearch} from './QuotationSearch';
import {LinkToButton} from '../../controls/form-controls/button/LinkToButton';
import {useDocumentTitle} from '../../hooks/useDocumentTitle';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {Claim} from '../../users/models/UserModel';


type QuotationListProps = {
  config: ConfigModel,
  invoices: InvoiceModel[],
  clients: ClientModel[],
  consultants: ConsultantModel[],
  updateInvoiceFilters: any,
  filters: InvoiceFilters,
}

// eslint-disable-next-line react/prefer-stateless-function
export const QuotationList = (props: QuotationListProps) => {
  useDocumentTitle('quotationList');

  if (!props.filters) {
    return null;
  }

  const vm = new InvoiceListModel(props.invoices, props.clients, props.consultants, props.filters, true);

  const TableComponent = props.filters.groupedByMonth ? GroupedInvoiceTable : NonGroupedInvoiceTable;
  return (
    <Container className="quotation-list">
      <Row>
        <Col xs={8}>
          <h1>{t('quotation.title')}</h1>
        </Col>
        <Col xs={4} style={{textAlign: 'right'}}>
          <LinkToButton claim={Claim.ViewInvoices} to="/invoices" label="title" />
        </Col>
      </Row>
      <QuotationSearch
        onChange={(newFilter: InvoiceFilters) => props.updateInvoiceFilters(newFilter)}
        filterOptions={vm.getFilterOptions()}
        filters={props.filters}
      />
      <TableComponent vm={vm} config={props.config} />
    </Container>
  );
};


export default connect((state: ConfacState) => ({
  invoices: state.invoices.filter(x => x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
  consultants: state.consultants,
}), {updateInvoiceFilters})(QuotationList);
