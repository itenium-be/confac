import React from 'react';
import {Table} from 'react-bootstrap';
import {InvoiceListFooter, InvoiceListRow} from '../invoice-list/InvoiceListRow';
import {getNonGroupedInvoiceTableColumns} from './invoice-list-column-factory';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceListModel from '../models/InvoiceListModel';
import {ListHeader} from '../../controls/table/ListHeader';

export const NonGroupedInvoiceTable = ({vm, config}: {vm: InvoiceListModel, config: ConfigModel}) => {
  const invoices = vm.getFilteredInvoices();
  const columns = getNonGroupedInvoiceTableColumns(config.showOrderNr, vm.isQuotation);
  return (
    <Table size="sm">
      <ListHeader columns={columns} />
      <tbody>
        {invoices.sort((a, b) => b.number - a.number).map(invoice => (
          <InvoiceListRow columns={columns} invoice={invoice} key={invoice._id} />
        ))}
      </tbody>
      <InvoiceListFooter columns={columns} invoices={invoices} isQuotation={vm.isQuotation} />
    </Table>
  );
};
