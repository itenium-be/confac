import React from 'react';
import {groupInvoicesPerMonth} from '../EditInvoiceViewModel.js';

import {Table} from 'react-bootstrap';
import {InvoiceListHeader, InvoiceListFooter, InvoiceListRow} from '../InvoiceListRow.js';
import {InvoiceWorkedDays} from '../controls/InvoiceWorkedDays.js';
import {InvoicesTotal} from '../controls/InvoiceTotal.js';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary.js';
import {getColumns} from './invoice-list-column-factory.js';


export const GroupedInvoiceTable = ({vm, config}) => {
  const invoices = vm.getFilteredInvoices();
  const columns = getColumns(['date-month', 'number', 'client'], config.showOrderNr, vm.isQuotation);
  const invoicesPerMonth = groupInvoicesPerMonth(invoices).sort((a, b) => b.key.localeCompare(a.key));

  const hideBorderStyle = {borderBottom: 0, borderTop: 0};
  const tst = (key, key2) => `invoice-${key}-${key2}`;

  return (
    <Table condensed style={{marginTop: 10}}>
      <InvoiceListHeader columns={columns} />

      {invoicesPerMonth.map(({key, invoiceList}) => [
        <tbody key={key}>
          {invoiceList.sort((a, b) => b.number - a.number).map((invoice, index) => (
            <InvoiceListRow
              key={invoice._id}
              columns={columns}
              invoice={invoice}
              isFirstRow={index === 0}
              onlyRowForMonth={invoiceList.length === 1}
            />
          ))}
        </tbody>,

        (!vm.isQuotation && invoiceList.length > 1) ? <tbody key={key + '-group-row'} style={hideBorderStyle}>
          <tr style={{...hideBorderStyle, height: 60}}>
            <td style={hideBorderStyle}>&nbsp;</td>
            <td colSpan={columns.length - 1}>
              <strong><InvoiceAmountLabel invoices={invoiceList} data-tst={tst(key, 'invoices')} isQuotation={vm.isQuotation} /></strong>
            </td>
            <td><strong><InvoiceWorkedDays invoices={invoiceList} data-tst={tst(key, 'days')} /></strong></td>
            <td><InvoicesTotal invoices={invoiceList} totalOnly data-tst={tst(key, 'money')} /></td>
            <td>&nbsp;</td>
          </tr>
        </tbody> : null
      ])}

      <InvoiceListFooter columns={columns} invoices={invoices} isQuotation={vm.isQuotation} />
    </Table>
  );
};
