import React from 'react';
import {InvoiceClientCell} from './InvoiceClientCell';
import {InvoiceNumberCell} from './InvoiceNumberCell';
import InvoiceModel from '../models/InvoiceModel';
import {formatDate, moneyFormat} from '../../utils';
import {IListCell, IListRow, IList} from '../../controls/table/table-models';
import {InvoiceWorkedDays} from '../invoice-list/InvoiceWorkedDays';
import {NotEmailedIcon} from '../../controls/Icon';
import {InvoiceListRowActions} from './InvoiceListRowActions';
import {getInvoiceListRowClass} from './getInvoiceListRowClass';
import {InvoiceAmountLabel} from '../controls/InvoicesSummary';
import {InvoicesTotal} from '../invoice-edit/InvoiceTotal';


export interface IInvoiceListConfig {
  showOrderNr: boolean;
  isQuotation: boolean;
  invoicePayDays: number;
}


export function getGroupedInvoiceList(config: IInvoiceListConfig): IList<InvoiceModel> {
  return createInvoiceList(['date-month', 'number', 'client'], config);
}


export function getNonGroupedInvoiceList(config: IInvoiceListConfig): IList<InvoiceModel> {
  return createInvoiceList(['number', 'client', 'date-full'], config);
}

function createInvoiceList(colsTillTotalAmount: string[], config: IInvoiceListConfig): IList<InvoiceModel> {
  const transPrefix = config.isQuotation ? 'quotation' : 'invoice';
  const listRows: IListRow<InvoiceModel> = {
    className: invoice => getInvoiceListRowClass(invoice, config.invoicePayDays),
    cells: getInvoiceColumns([
      ...colsTillTotalAmount,
      'total-amount',
      'buttons',
      config.showOrderNr ? '' : 'orderNr',
      'invoice-days',
    ], transPrefix),
  };

  return {
    rows: listRows,
  };
}


export function getInvoiceColumns(includeFields: string[], transPrefix: string): IListCell<InvoiceModel>[] {
  const isGroupedTable = includeFields.includes('date-month');
  const columns: IListCell<InvoiceModel>[] = [{
    key: 'date-month',
    header: `${transPrefix}.date`,
    value: (i: InvoiceModel) => i.date.format('MMM YYYY'),
    footer: (invoices: InvoiceModel[]) => <InvoiceAmountLabel invoices={invoices} isQuotation={invoices[0].isQuotation} />,
  }, {
    key: 'number',
    header: 'invoice.numberShort',
    value: (i: InvoiceModel) => <InvoiceNumberCell invoice={i} />,
    footer: (invoices: InvoiceModel[]) => !isGroupedTable && <InvoiceAmountLabel invoices={invoices} isQuotation={invoices[0].isQuotation} />,
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
    footer: invoices => <InvoiceWorkedDays invoices={invoices} />,
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
    footer: invoices => <InvoicesTotal invoices={invoices} />,
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
