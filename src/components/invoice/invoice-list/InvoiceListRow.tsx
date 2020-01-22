import React from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {InvoiceWorkedDays} from './InvoiceWorkedDays';
import {InvoicesTotal} from '../invoice-edit/InvoiceTotal';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {IListCell} from '../../controls/table/table-models';


type InvoiceListFooterProps = {
  columns: IListCell[];
  invoices: InvoiceModel[];
  isQuotation: boolean;
}

export const InvoiceListFooter = ({columns, invoices, isQuotation}: InvoiceListFooterProps) => {
  if (invoices.length === 0) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        <td colSpan={columns.length - 3}>
          <InvoiceAmountLabel invoices={invoices} isQuotation={isQuotation} data-tst="list-total-invoices" />
        </td>
        <td><InvoiceWorkedDays invoices={invoices} data-tst="list-total-days" /></td>
        <td colSpan={2}><InvoicesTotal invoices={invoices} data-tst="list-total-money" /></td>
      </tr>
    </tfoot>
  );
};




/**
 * Gets the Bootstrap variant based on the Invoice due date
 */
export function getInvoiceDueDateVariant(
  invoice: InvoiceModel,
  invoicePayDays: number = 30,
): '' | 'danger' | 'warning' | 'primary' | 'info' {

  /** Danger: This many days overdue and not yet paid */
  const DangerDays = 10;
  /** Primary: Expiration date due in this many days. */
  const WatchDays = 5;

  if (invoice.verified) {
    return '';
  }

  if (invoice.isQuotation) {
    return '';
  }

  const payDate = moment(invoice.date).add(invoicePayDays, 'days');
  if (moment().isAfter(moment(payDate).add(DangerDays, 'days'))) {
    return 'danger';
  }

  if (moment().isAfter(payDate)) {
    return 'warning';
  }

  if (moment().isAfter(moment(payDate).subtract(WatchDays, 'days'))) {
    return 'primary';
  }

  return 'info';
}



type InvoiceListRowProps = {
  columns: IListCell[],
  invoice: InvoiceModel,
}

export const InvoiceListRow = ({invoice, columns}: InvoiceListRowProps) => {
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);
  const rowTableClassName = `table-${getInvoiceDueDateVariant(invoice, invoicePayDays)}`;

  return (
    <tr className={rowTableClassName}>
      {columns.map((col, i) => {
        return (
          <td key={i} style={col.style} className={col.className}>
            {col.value(invoice)}
          </td>
        );
      })}
    </tr>
  );
};
