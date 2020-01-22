import React from 'react';
import {Table} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {groupInvoicesPerMonth} from '../models/InvoiceModel';
import {InvoiceListFooter, getInvoiceDueDateVariant} from '../invoice-list/InvoiceListRow';
import {InvoiceWorkedDays} from '../invoice-list/InvoiceWorkedDays';
import {InvoicesTotal} from '../invoice-edit/InvoiceTotal';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary';
import {getGroupedInvoiceTableColumns} from './invoice-list-column-factory';
import {ConfigModel} from '../../config/models/ConfigModel';
import InvoiceListModel from '../models/InvoiceListModel';
import {ConfacState} from '../../../reducers/app-state';
import {ListHeader} from '../../controls/table/ListHeader';


type GroupedInvoiceTableProps = {
  vm: InvoiceListModel;
  config: ConfigModel;
}

export const GroupedInvoiceTable = ({vm, config}: GroupedInvoiceTableProps) => {
  const invoices = vm.getFilteredInvoices();
  const columns = getGroupedInvoiceTableColumns(config.showOrderNr, vm.isQuotation);
  const invoicesPerMonth = groupInvoicesPerMonth(invoices).sort((a, b) => b.key.localeCompare(a.key));

  const hideBorderStyle = {borderBottom: 0, borderTop: 0};
  const tst = (key, key2) => `invoice-${key}-${key2}`;

  return (
    <Table size="sm" style={{marginTop: 10}}>
      <ListHeader columns={columns} />

      {invoicesPerMonth.map(({key, invoiceList}) => [
        <tbody key={key}>
          {invoiceList.sort((a, b) => b.number - a.number).map((invoice, index) => (
            <GroupedInvoiceListRow
              key={invoice._id}
              columns={columns}
              invoice={invoice}
              isFirstRow={index === 0}
            />
          ))}
        </tbody>,

        (!vm.isQuotation && invoiceList.length > 1) && (
          <tbody key={`${key}-group-row`} style={hideBorderStyle}>
            <tr style={{...hideBorderStyle, height: 60}}>
              <td style={hideBorderStyle}>&nbsp;</td>
              <td colSpan={columns.length - 1}>
                <strong><InvoiceAmountLabel invoices={invoiceList} data-tst={tst(key, 'invoices')} isQuotation={vm.isQuotation} /></strong>
              </td>
              <td><strong><InvoiceWorkedDays invoices={invoiceList} data-tst={tst(key, 'days')} /></strong></td>
              <td><InvoicesTotal invoices={invoiceList} totalOnly data-tst={tst(key, 'money')} /></td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        ),
      ])}

      <InvoiceListFooter columns={columns} invoices={invoices} isQuotation={vm.isQuotation} />
    </Table>
  );
};


const GroupedInvoiceListRow = ({invoice, isFirstRow, columns}: any) => {
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);
  const rowTableClassName = `table-${getInvoiceDueDateVariant(invoice, invoicePayDays)}`;

  const borderStyle = columns.some(col => col.groupedBy) ? {borderBottom: 0, borderTop: 0} : undefined;
  return (
    <tr className={rowTableClassName} style={borderStyle}>
      {columns.map((col, i) => {
        const isGroupedByColumn = col.key === 'date-month';
        const hideValue = !isFirstRow && isGroupedByColumn;
        return (
          <td key={i} style={isGroupedByColumn ? borderStyle : undefined} className={col.className}>
            {hideValue ? null : col.value(invoice)}
          </td>
        );
      })}
    </tr>
  );
};
