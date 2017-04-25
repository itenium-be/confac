import React from 'react';
import ReactTooltip from 'react-tooltip';
import {t, moneyFormat} from '../../util.js';

export const InvoiceAmountLabel = ({invoices, ...props}) => {
  if (invoices.length === 1) {
    return <span data-tst={props['data-tst']}>{t('invoice.invoicesOne')}</span>; //eslint-disable-line
  }
  return <span data-tst={props['data-tst']}>{invoices.length} {t('invoice.invoices').toLowerCase()}</span>; //eslint-disable-line
};

export const InvoicesSummary = ({invoices, ...props}) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), {totalWithoutTax: 0, totalTax: 0, total: 0});

  if (money.total === 0) {
    return <div />;
  }

  var tooltip = t('invoice.subtotal') + ': ' + moneyFormat(money.totalWithoutTax);
  tooltip += '<br>';
  tooltip += t('invoice.taxtotalShort') + ': ' + moneyFormat(money.totalTax);
  tooltip += '<br>';
  tooltip += t('invoice.total') + ': ' + moneyFormat(money.total);

  const tst = props['data-tst']; //eslint-disable-line
  return (
    <div data-tip={tooltip}>
      <ReactTooltip multiline={true} />
      <div>
        <InvoiceAmountLabel invoices={invoices} data-tst={tst + '-amount'} />
        <br />
        <span data-tst={tst + '-total'}>{moneyFormat(money.total)}</span>
      </div>
    </div>
  );
};
