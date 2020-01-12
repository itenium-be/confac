import React from 'react';
import {Table} from 'react-bootstrap';
import {InvoiceListHeader, InvoiceListFooter, InvoiceListRow} from '../invoice-list/InvoiceListRow';
import {getColumns} from './invoice-list-column-factory';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceListModel from '../models/InvoiceListModel';

export const NonGroupedInvoiceTable = ({vm, config}: {vm: InvoiceListModel, config: ConfigModel}) => {
  const invoices = vm.getFilteredInvoices();
  const columns = getColumns(['number', 'client', 'date-full'], config.showOrderNr, vm.isQuotation);
  return (
    <Table size="sm" style={{marginTop: 10}}>
      <InvoiceListHeader columns={columns} />
      <tbody>
        {invoices.sort((a, b) => b.number - a.number).map((invoice) => (
          <InvoiceListRow columns={columns} invoice={invoice} key={invoice._id} />
        ))}
      </tbody>
      <InvoiceListFooter columns={columns} invoices={invoices} isQuotation={vm.isQuotation} />
    </Table>
  );
};
