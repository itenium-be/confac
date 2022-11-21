import React, {Component, useState} from 'react';
import {Row, Col, ButtonGroup} from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {t} from '../../utils';
import {InvoiceFiltersSearch, InvoiceFilters} from '../../../models';
import {InvoiceSearchSelect} from './InvoiceSearchSelect';
import {SearchStringInput} from '../../controls/form-controls/inputs/SearchStringInput';
import {downloadInvoicesZip, downloadInvoicesExcel} from '../../../actions';
import InvoiceListModel from '../models/InvoiceListModel';
import {Switch} from '../../controls/form-controls/Switch';
import {Button} from '../../controls/form-controls/Button';


type InvoiceSearchProps = {
  filterOptions: InvoiceFiltersSearch[],
  onChange: (newFilter: InvoiceFilters) => void,
  isQuotation: boolean,
  filters: InvoiceFilters,
  vm: InvoiceListModel,
}


export class InvoiceSearch extends Component<InvoiceSearchProps> {
  onFilterChange(updateObj: InvoiceFilters | {}) {
    const newFilter: InvoiceFilters = {...this.props.filters, ...updateObj};
    this.props.onChange(newFilter);
  }

  render() {
    const {search, freeInvoice} = this.props.filters;
    return (
      <Row>
        <Col xl={4} md={4} className="list">
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
          />
          <Button
            variant="outline-secondary"
            onClick={downloadExcel}
            title={t('invoice.listDownloadExcel')}
            icon="fa fa-file-excel"
          />
          <Button
            variant="outline-secondary"
            onClick={() => setOpen(!open)}
            title={t('invoice.listAdvancedFilters')}
            icon="fa fa-ellipsis-v"
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
