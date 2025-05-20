import {connect} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {updateAppFilters, updateInvoiceFilters, updateInvoiceRequest} from '../../../actions/index';
import InvoiceListModel from '../models/InvoiceListModel';
import {GroupedInvoiceTable} from '../invoice-table/GroupedInvoiceTable';
import {NonGroupedInvoiceTable} from '../invoice-table/NonGroupedInvoiceTable';
import {ConfacState} from '../../../reducers/app-state';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceModel from '../models/InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {t} from '../../utils';
import {QuotationSearch} from './QuotationSearch';
import {LinkToButton} from '../../controls/form-controls/button/LinkToButton';
import {useDocumentTitle} from '../../hooks/useDocumentTitle';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {Claim} from '../../users/models/UserModel';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { InvoiceFeatureBuilderConfig } from '../models/getInvoiceFeature';
import { Features } from '../../controls/feature/feature-models';
import { InvoiceListFilters } from '../../controls/table/table-models';


type QuotationListProps = {
  config: ConfigModel,
  invoices: InvoiceModel[],
  clients: ClientModel[],
  consultants: ConsultantModel[],
  updateInvoiceFilters: any,
  filters: InvoiceListFilters,
}

// eslint-disable-next-line react/prefer-stateless-function
export const QuotationList = (props: QuotationListProps) => {
  useDocumentTitle('quotationList');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoiceFilters = useSelector((state: ConfacState) => state.app.filters.projects);
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);

  if (!props.filters) {
    return null;
  }

  const vm = new InvoiceListModel(props.invoices, props.clients, props.consultants, props.filters, true);

  const invoices = vm.getFilteredInvoices();
  const config: InvoiceFeatureBuilderConfig = {
    isQuotation: vm.isQuotation,
    invoicePayDays,
    isGroupedOnMonth: false,
    data: invoices,
    save: m => dispatch(updateInvoiceRequest(m, undefined, false, navigate) as any),
    filters: invoiceFilters,
    setFilters: f => dispatch(updateAppFilters(Features.invoices, f)),
  };

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
        onChange={(newFilter: InvoiceListFilters) => props.updateInvoiceFilters(newFilter)}
        filterOptions={vm.getFilterOptions()}
        filters={props.filters}
      />
      <TableComponent config={config} />
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
