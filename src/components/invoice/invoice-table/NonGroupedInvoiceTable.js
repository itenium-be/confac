import React from 'react';
import {Table} from 'react-bootstrap';
import {InvoiceListHeader, InvoiceListFooter, InvoiceListRow} from '../InvoiceListRow.js';
import {getColumns} from './invoice-list-column-factory.js';

export const NonGroupedInvoiceTable = ({vm, config}) => {
  const invoices = vm.getFilteredInvoices();
  const columns = getColumns(['number', 'client', 'date-full'], config.showOrderNr, vm.isQuotation);
  return (
    <Table condensed style={{marginTop: 10}}>
      <InvoiceListHeader columns={columns} />
      <tbody>
        {invoices.sort((a, b) => b.number - a.number).map(invoice => (
          <InvoiceListRow columns={columns} invoice={invoice} key={invoice._id} />
        ))}
      </tbody>
      <InvoiceListFooter columns={columns} invoices={invoices} isQuotation={vm.isQuotation} />
    </Table>
  );
};
