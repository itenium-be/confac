import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {moneyFormat, t} from '../../utils';
import {ConfirmedDeleteIcon, EditIcon, InvoiceDownloadIcon, InvoicePreviewIcon, InvoiceVerifyIconToggle, NotEmailedIcon} from '../../controls';
import {deleteInvoice} from '../../../actions/index';
import {InvoiceWorkedDays} from './InvoiceWorkedDays';
import {InvoicesTotal} from '../invoice-edit/InvoiceTotal';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';


export const InvoiceListHeader = ({columns}) => (
  <thead>
    <tr>
      {columns.map((col, i) => <th key={i}>{col.header}</th>)}
      <th>{t('invoice.days')}</th>
      <th style={{width: '10%'}}>{t('invoice.totalTitle')}</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
);


export const InvoiceListFooter = ({columns, invoices, isQuotation}) => {
  if (invoices.length === 0) {
    return null;
  }

  return (
    <tfoot>
      <tr>
        <td colSpan={columns.length}><InvoiceAmountLabel invoices={invoices} isQuotation={isQuotation} data-tst="list-total-invoices" /></td>
        <td><InvoiceWorkedDays invoices={invoices} data-tst="list-total-days" /></td>
        <td colSpan={2}><InvoicesTotal invoices={invoices} data-tst="list-total-money" /></td>
      </tr>
    </tfoot>
  );
};

type InvoiceListRowProps = {
  columns: Array<{
    header: string,
    value: Function,
    groupedBy?: boolean,
  }>,
  invoice: InvoiceModel,
  isFirstRow?: boolean
  onlyRowForMonth?: boolean,
}


/**
 * Gets the Bootstrap variant based on the Invoice due date
 */
export function getInvoiceDueDateVariant(invoice: InvoiceModel, invoicePayDays: number = 30): '' | 'danger' | 'warning' | 'primary' | 'info' {
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



export const InvoiceListRow = ({invoice, isFirstRow, onlyRowForMonth, columns}: InvoiceListRowProps) => {
  const dispatch = useDispatch();
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);

  const borderStyle = columns.some(col => col.groupedBy) ? {borderBottom: 0, borderTop: 0} : undefined;
  const tst = (key: string): string => `list-${invoice._id}-${key}`;

  const invoiceType = invoice.isQuotation ? 'quotation' : 'invoice';

  const rowTableClassName = `table-${getInvoiceDueDateVariant(invoice, invoicePayDays)}`;

  return (
    <tr className={rowTableClassName} style={borderStyle}>
      {columns.map((col, i) => {
        const hideValue = !isFirstRow && col.groupedBy;
        return (
          <td key={i} style={col.groupedBy ? borderStyle : undefined} data-tst={tst(col.header)}>
            {hideValue ? null : col.value(invoice)}
          </td>
        );
      })}
      <td style={{whiteSpace: 'nowrap'}}>
        <InvoiceWorkedDays invoices={[invoice]} display={onlyRowForMonth ? undefined : 'invoice'} data-tst={tst('days')} />
      </td>
      <td style={{textAlign: 'right', whiteSpace: 'nowrap'}} data-tst={tst('money-total')}>
        {!invoice.verified && !invoice.lastEmail && <NotEmailedIcon style={{marginRight: 6, fontSize: 12}} />}
        {moneyFormat(invoice.money.total)}
      </td>
      <td className="icons-cell" style={{width: 240}}>
        <EditIcon onClick={`/${invoiceType}s/${invoice.number}`} data-tst={tst('edit')} style={{marginRight: invoice.isQuotation ? undefined : -15}} />
        <InvoiceVerifyIconToggle invoice={invoice} data-tst={tst('verify')} />
        <InvoiceDownloadIcon invoice={invoice} data-tst={tst('download')} />
        <InvoicePreviewIcon invoice={invoice} data-tst={tst('preview')} />
        <ConfirmedDeleteIcon title={t(`${invoiceType}.deleteTitle`)} onClick={() => dispatch(deleteInvoice(invoice))} data-tst={tst('delete')}>
          {t(`${invoiceType}.deletePopup`, {number: invoice.number, client: invoice.client.name})}
        </ConfirmedDeleteIcon>
      </td>
    </tr>
  );
};
