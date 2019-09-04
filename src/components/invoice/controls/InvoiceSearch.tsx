import React, {Component, useState} from 'react';
import {t} from '../../util';
import {Row, Col, ButtonGroup, Button} from 'react-bootstrap';
import {Switch, Icon} from '../../controls';
import { InvoiceFiltersSearch, InvoiceFilters } from '../../../models';
import { InvoiceSearchSelect } from './InvoiceSearchSelect';
import { SearchStringInput } from '../../controls/form-controls/inputs/SearchStringInput';
import { useDispatch } from 'react-redux';
import { downloadInvoicesZip, downloadInvoicesExcel } from '../../../actions';
import InvoiceListModel from '../models/InvoiceListModel';


type InvoiceSearchProps = {
  filterOptions: InvoiceFiltersSearch[],
  onChange: (newFilter: InvoiceFilters) => void,
  isQuotation: boolean,
  filters: InvoiceFilters,
  vm: InvoiceListModel,
}


export class InvoiceSearch extends Component<InvoiceSearchProps> {
  onFilterChange(updateObj: InvoiceFilters | {}) {
    const newFilter: InvoiceFilters = Object.assign({}, this.props.filters, updateObj);
    this.props.onChange(newFilter);
  }

  render() {
    const {search, freeInvoice} = this.props.filters;
    return (
      <Row>
        <Col xl={4} md={4}>
          <SearchStringInput
            value={freeInvoice}
            onChange={str => this.onFilterChange({freeInvoice: str})}
          />
        </Col>
        <Col xl={6} md={6}>
          <InvoiceSearchSelect
            onChange={(value: InvoiceFiltersSearch[]) => this.onFilterChange({search: value})}
            value={search}
            options={this.props.filterOptions}
            data-tst="filter-all"
          />
        </Col>

        <InvoiceSearchAdvanced
          groupedByMonth={this.props.filters.groupedByMonth}
          onGroupedByMonthCange={(checked: boolean) => this.onFilterChange({groupedByMonth: checked})}
          vm={this.props.vm}
        />

      </Row>
    );
  }
}

type InvoiceSearchAdvancedProps = {
  groupedByMonth: boolean,
  onGroupedByMonthCange: (checked: boolean) => void,
  vm: InvoiceListModel,
}

const InvoiceSearchAdvanced = (props: InvoiceSearchAdvancedProps) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const downloadExcel = () => {
    const invoices = props.vm.getFilteredInvoices();
    const invoiceIds = invoices.map(i => i._id);
    dispatch(downloadInvoicesExcel(invoiceIds));
  };
  const downloadZip = () => {
    const invoices = props.vm.getFilteredInvoices();
    const invoiceIds = invoices.map(i => i._id);
    dispatch(downloadInvoicesZip(invoiceIds));
  };

  return(
    <>
      <Col xl={2} md={2}>
        <ButtonGroup style={{float: 'right'}}>
          <Button variant="outline-secondary" onClick={downloadZip}><Icon fa="fa fa-download" size={1} title={t('invoice.listDownloadZip')} /></Button>
          <Button variant="outline-secondary" onClick={downloadExcel}><Icon fa="fa fa-file-excel" size={1} title={t('invoice.listDownloadExcel')} /></Button>
          <Button variant="outline-secondary" onClick={() => setOpen(!open)}><Icon fa="fa fa-ellipsis-v" size={1} title={t('invoice.listAdvancedFilters')} /></Button>
        </ButtonGroup>
      </Col>
      {open && (
        <Row style={{paddingTop: 25, paddingLeft: 25}}>
          <Col>
            <Switch
              value={props.groupedByMonth}
              onChange={(checked: boolean) => props.onGroupedByMonthCange(checked)}
              label={t('invoice.groupByMonth')}
              data-tst="filter-groupedByMonth"
            />
          </Col>
        </Row>
      )}
    </>
  )
}
