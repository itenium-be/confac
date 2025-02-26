import {useState} from 'react';
import {Row, Col, ButtonGroup} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {t} from '../../utils';
import {InvoiceSearchSelect} from './InvoiceSearchSelect';
import {SearchStringInput} from '../../controls/form-controls/inputs/SearchStringInput';
import {downloadInvoicesZip, downloadInvoicesExcel} from '../../../actions';
import InvoiceListModel from '../models/InvoiceListModel';
import {Switch} from '../../controls/form-controls/Switch';
import {Button} from '../../controls/form-controls/Button';
import { InvoiceFiltersSearch, InvoiceListFilters } from '../../controls/table/table-models';


type InvoiceSearchProps = {
  filterOptions: InvoiceFiltersSearch[],
  onChange: (newFilter: InvoiceListFilters) => void,
  isQuotation: boolean,
  filters: InvoiceListFilters,
  vm: InvoiceListModel,
}



export const InvoiceSearch = (props: InvoiceSearchProps) => {
  const onFilterChange = (updateObj: Partial<InvoiceListFilters>) => {
    const newFilter: InvoiceListFilters = {...props.filters, ...updateObj};
    props.onChange(newFilter);
  }

  return (
    <Row>
      <Col xl={4} md={4} className="list">
        <SearchStringInput
          value={props.filters.freeInvoice}
          onChange={str => onFilterChange({freeInvoice: str})}
        />
      </Col>
      <Col xl={6} md={6}>
        <InvoiceSearchSelect
          onChange={(value: InvoiceFiltersSearch[]) => onFilterChange({search: value})}
          value={props.filters.search}
          options={props.filterOptions}
        />
      </Col>

      <InvoiceSearchAdvanced
        groupedByMonth={props.filters.groupedByMonth}
        onGroupedByMonthCange={(checked: boolean) => onFilterChange({groupedByMonth: checked})}
        vm={props.vm}
      />
    </Row>
  );
}

type InvoiceSearchAdvancedProps = {
  groupedByMonth: boolean,
  onGroupedByMonthCange: (checked: boolean) => void,
  vm: InvoiceListModel,
}


/** Download zip/excel, toggle GroupedTable */
const InvoiceSearchAdvanced = (props: InvoiceSearchAdvancedProps) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const downloadExcel = () => {
    const invoices = props.vm.getFilteredInvoices();
    const invoiceIds = invoices.map(i => i._id);
    dispatch(downloadInvoicesExcel(invoiceIds) as any);
  };
  const downloadZip = () => {
    const invoices = props.vm.getFilteredInvoices();
    const invoiceIds = invoices.map(i => i._id);
    dispatch(downloadInvoicesZip(invoiceIds) as any);
  };

  return (
    <>
      <Col xl={2} md={2}>
        <ButtonGroup style={{float: 'right'}}>
          <Button
            variant="outline-secondary"
            onClick={downloadZip}
            title={t('invoice.listDownloadZip')}
            icon="fa fa-download"
            className="tst-download-zip"
          />
          <Button
            variant="outline-secondary"
            onClick={downloadExcel}
            title={t('invoice.listDownloadExcel')}
            icon="fa fa-file-excel"
            className="tst-download-excel"
          />
          <Button
            variant="outline-secondary"
            onClick={() => setOpen(!open)}
            title={t('invoice.listAdvancedFilters')}
            icon="fa fa-ellipsis-v"
            className="tst-toggle-filter"
          />
        </ButtonGroup>
      </Col>
      {open && (
        <Row style={{paddingBottom: 10, paddingLeft: 25}}>
          <Col>
            <Switch
              value={props.groupedByMonth}
              onChange={(checked: boolean) => props.onGroupedByMonthCange(checked)}
              label={t('invoice.groupByMonth')}
            />
          </Col>
        </Row>
      )}
    </>
  );
};
