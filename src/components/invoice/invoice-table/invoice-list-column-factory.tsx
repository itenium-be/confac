import React from 'react';
import t from '../../../trans';
import {InvoiceClientCell} from './InvoiceClientCell';
import {InvoiceNumberCell} from './InvoiceNumberCell';
import InvoiceModel from '../models/InvoiceModel';
import {formatDate} from '../../utils';

type TableCell = {
  key: string,
  header: string,
  value: (i: InvoiceModel) => string | React.ReactNode,
}

export function getColumns(fields: string[], showOrderNr: boolean, isQuotation: boolean): TableCell[] {
  const transPrefix = isQuotation ? 'quotation' : 'invoice';
  const columns = [{
    key: 'date-month',
    header: t(`${transPrefix}.date`),
    value: (i: InvoiceModel) => i.date.format('MMM YYYY'),
    groupedBy: true,
  }, {
    key: 'number',
    header: t('invoice.numberShort'),
    value: (i: InvoiceModel) => <InvoiceNumberCell invoice={i} />,
  }, {
    key: 'client',
    header: t('invoice.client'),
    value: (i: InvoiceModel) => <InvoiceClientCell client={i.client} />,
  }, {
    key: 'date-full',
    header: t(`${transPrefix}.date`),
    value: (i: InvoiceModel) => formatDate(i.date),
  }];

  if (showOrderNr) {
    fields.push('orderNr');
    columns.push({
      key: 'orderNr',
      header: t(`${transPrefix}.orderNrShort`),
      value: (i: InvoiceModel) => i.orderNr,
    });
  }

  return columns.filter((col) => fields.includes(col.key));
}
