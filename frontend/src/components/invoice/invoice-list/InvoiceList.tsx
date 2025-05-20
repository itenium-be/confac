import {connect} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {updateAppFilters, updateInvoiceFilters, updateInvoiceRequest} from '../../../actions/index';
import InvoiceListModel from '../models/InvoiceListModel';
import {InvoiceSearch} from '../controls/InvoiceSearch';
import {GroupedInvoiceTable} from '../invoice-table/GroupedInvoiceTable';
import {NonGroupedInvoiceTable} from '../invoice-table/NonGroupedInvoiceTable';
import {ConfacState} from '../../../reducers/app-state';
import InvoiceModel from '../models/InvoiceModel';
import {ClientModel} from '../../client/models/ClientModels';
import {t} from '../../utils';
import {LinkToButton} from '../../controls/form-controls/button/LinkToButton';
import {useDocumentTitle} from '../../hooks/useDocumentTitle';
import {ConsultantModel} from '../../consultant/models/ConsultantModel';
import {Claim} from '../../users/models/UserModel';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {InvoiceFeatureBuilderConfig} from '../models/getInvoiceFeature';
import {Features} from '../../controls/feature/feature-models';
import {InvoiceListFilters} from '../../controls/table/table-models';


type InvoiceListProps = {
  invoices: InvoiceModel[];
  clients: ClientModel[];
  consultants: ConsultantModel[];
  updateInvoiceFilters: any;
  filters: InvoiceListFilters;
}


export const InvoiceList = (props: InvoiceListProps) => {
  useDocumentTitle('invoiceList');
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const invoiceFilters = useSelector((state: ConfacState) => state.app.filters.invoices);


  if (!props.filters) {
    return null;
  }

  const isQuotation = window.location.pathname === '/quotations';
  const vm = new InvoiceListModel(props.invoices, props.clients, props.consultants, props.filters, isQuotation);

  const invoices = vm.getFilteredInvoices();
  const featureConfig: InvoiceFeatureBuilderConfig = {
    isQuotation: vm.isQuotation,
    invoicePayDays,
    isGroupedOnMonth: props.filters.groupedByMonth,
    data: invoices,
    save: m => dispatch(updateInvoiceRequest(m, undefined, false, navigate) as any),
    filters: invoiceFilters,
    setFilters: f => dispatch(updateAppFilters(Features.invoices, f)),
    buttons: ['edit', 'validate', 'download', 'preview', 'delete']
  };


  const TableComponent = props.filters.groupedByMonth ? GroupedInvoiceTable : NonGroupedInvoiceTable;
  return (
    <Container className="invoice-list" style={{maxWidth: 1600}}>
      {!isQuotation && (
        <Row>
          <Col xs={8}>
            <h1>{t('title')}</h1>
          </Col>
          <Col xs={4} style={{textAlign: 'right'}}>
            <LinkToButton claim={Claim.ViewQuotations} to="/quotations" label="quotation.title" />
          </Col>
        </Row>
      )}
      <InvoiceSearch
        onChange={(newFilter: InvoiceListFilters) => props.updateInvoiceFilters(newFilter)}
        filterOptions={vm.getFilterOptions()}
        filters={props.filters}
        vm={vm}
      />
      <TableComponent config={featureConfig} />
    </Container>
  );
};


export default connect((state: ConfacState) => ({
  invoices: state.invoices.filter(x => !x.isQuotation),
  clients: state.clients,
  filters: state.app.invoiceFilters,
  consultants: state.consultants,
}), {updateInvoiceFilters})(InvoiceList);
