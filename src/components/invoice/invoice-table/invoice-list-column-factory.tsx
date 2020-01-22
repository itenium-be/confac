import React from 'react';
import {InvoiceClientCell} from './InvoiceClientCell';
import {InvoiceNumberCell} from './InvoiceNumberCell';
import InvoiceModel from '../models/InvoiceModel';
import {formatDate, moneyFormat} from '../../utils';
import {IListCell} from '../../controls/table/table-models';
import {InvoiceWorkedDays} from '../invoice-list/InvoiceWorkedDays';
import {NotEmailedIcon} from '../../controls/Icon';
import {InvoiceListRowActions} from './InvoiceListRowActions';


export function getGroupedInvoiceTableColumns(showOrderNr: boolean, isQuotation: boolean): IListCell[] {
  const transPrefix = isQuotation ? 'quotation' : 'invoice';
  return getInvoiceColumns([
    'date-month',
    'number',
    'client',
    'total-amount',
    'buttons',
    showOrderNr ? '' : 'orderNr',
    'invoice-days',
  ], transPrefix);
}


export function getNonGroupedInvoiceTableColumns(showOrderNr: boolean, isQuotation: boolean): IListCell[] {
  const transPrefix = isQuotation ? 'quotation' : 'invoice';
  return getInvoiceColumns([
    'number',
    'client',
    'date-full',
    'total-amount',
    'buttons',
    showOrderNr ? '' : 'orderNr',
    'invoice-days',
  ], transPrefix);
}

export function getInvoiceList() {

}


export function getInvoiceColumns(includeFields: string[], transPrefix: string): IListCell[] {
  const columns: IListCell[] = [{
    key: 'date-month',
    header: `${transPrefix}.date`,
    value: (i: InvoiceModel) => i.date.format('MMM YYYY'),
  }, {
    key: 'number',
    header: 'invoice.numberShort',
    value: (i: InvoiceModel) => <InvoiceNumberCell invoice={i} />,
  }, {
    key: 'client',
    header: 'invoice.client',
    value: (i: InvoiceModel) => <InvoiceClientCell client={i.client} />,
  }, {
    key: 'date-full',
    header: `${transPrefix}.date`,
    value: (i: InvoiceModel) => formatDate(i.date),
  }, {
    key: 'orderNr',
    header: `${transPrefix}.orderNrShort`,
    value: (i: InvoiceModel) => i.orderNr,
  }, {
    key: 'invoice-days',
    header: 'invoice.days',
    value: (invoice: InvoiceModel) => (
      <InvoiceWorkedDays
        invoices={[invoice]}
        display="invoice"
        data-tst="invoice-days"
      />
    ),
  }, {
    key: 'total-amount',
    header: {
      title: 'invoice.totalTitle',
      width: '10%',
    },
    style: {textAlign: 'right', whiteSpace: 'nowrap'},
    value: (invoice: InvoiceModel) => (
      <>
        {!invoice.verified && !invoice.lastEmail && <NotEmailedIcon style={{marginRight: 6, fontSize: 12}} />}
        {moneyFormat(invoice.money.total)}
      </>
    ),
  }, {
    key: 'buttons',
    header: '',
    style: {width: 240},
    className: 'icons-cell',
    value: (i: InvoiceModel) => <InvoiceListRowActions invoice={i} />,
  }];

  const result = columns.filter(col => includeFields.includes(col.key));
  // console.log('result, ', result);
  return result;
}
