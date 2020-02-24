import React from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {updateInvoiceFilters} from '../../../actions/index';
import InvoiceListModel from '../models/InvoiceListModel';
import {InvoiceSearch} from '../controls/InvoiceSearch';
import {GroupedInvoiceTable} from '../invoice-table/GroupedInvoiceTable';
import {NonGroupedInvoiceTable} from '../invoice-table/NonGroupedInvoiceTable';
import {ConfacState} from '../../../reducers/app-state';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceModel from '../models/InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {InvoiceFilters} from '../../../models';
import {t} from '../../utils';
import {LinkToButton} from '../../controls/form-controls/button/LinkToButton';
import {useDocumentTitle} from '../../hooks/useDocumentTitle';


type InvoiceListProps = {
  config: ConfigModel,
  invoices: InvoiceModel[],
  clients: ClientModel[],
  updateInvoiceFilters: any,
  filters: InvoiceFilters,
}

// eslint-disable-next-line react/prefer-stateless-function
export const InvoiceList = (props: InvoiceListProps) => {
  useDocumentTitle('invoiceList');

  if (!props.filters) {
    return null;
  }

  const isQuotation = window.location.pathname === '/quotations';
  const vm = new InvoiceListModel(props.invoices, props.clients, props.filters, isQuotation);

  const TableComponent = props.filters.groupedByMonth ? GroupedInvoiceTable : NonGroupedInvoiceTable;
  return (
    <Container className="invoice-list">
      {!isQuotation && (
        <Row>
          <Col xs={8}>
            <h1>{t('title')}</h1>
          </Col>
          <Col xs={4} style={{textAlign: 'right'}}>
            <LinkToButton to="/quotations" label="quotation.title" />
          </Col>
        </Row>
      )}
      <InvoiceSearch
        onChange={(newFilter: InvoiceFilters) => props.updateInvoiceFilters(newFilter)}
        filterOptions={vm.getFilterOptions()}
        filters={props.filters}
        isQuotation={vm.isQuotation}
        vm={vm}
      />
      <TableComponent vm={vm} config={props.config} />
    </Container>
  );
};


export default connect((state: ConfacState) => ({
  invoices: state.invoices.filter(x => !x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  config: state.config,
}), {updateInvoiceFilters})(InvoiceList);
