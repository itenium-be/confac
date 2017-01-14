import React from 'react';
import ReactTooltip from 'react-tooltip';
import {t, moneyFormat} from '../../util.js';

export const InvoicesSummary = ({invoices}) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), {totalWithoutTax: 0, totalTax: 0, total: 0});

  var tooltip = t('invoice.subtotal') + ': ' + moneyFormat(money.totalWithoutTax);
  tooltip += '<br>';
  tooltip += t('invoice.taxtotalShort') + ': ' + moneyFormat(money.totalTax);
  tooltip += '<br>';
  tooltip += t('invoice.total') + ': ' + moneyFormat(money.total);

  return (
    <div data-tip={tooltip}>
      <ReactTooltip multiline={true} />
      <div>
        {t('client.invoiceAmount', {amount: invoices.length})}
        <br />
        <span>{moneyFormat(money.total)}</span>
      </div>
    </div>
  );
};
