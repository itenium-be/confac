import React from 'react';
import { Tooltip } from '../../controls/Tooltip';
import { t, moneyFormat } from '../../utils';

export const InvoiceAmountLabel = ({ invoices, isQuotation, ...props }) => {
  const type = isQuotation ? 'quotation' : 'invoice';
  if (invoices.length === 1) {
    return <span data-tst={props['data-tst']}>{t(type + '.amountOne')}</span>; //eslint-disable-line
  }
  return <span data-tst={props['data-tst']}>{invoices.length} {t(type + '.amount').toLowerCase()}</span>; //eslint-disable-line
};


export const InvoicesSummary = ({ invoices, ...props }) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), { totalWithoutTax: 0, totalTax: 0, total: 0 });

  if (money.total === 0) {
    return null;
  }

  var tooltip = t('invoice.subtotal') + ': ' + moneyFormat(money.totalWithoutTax);
  tooltip += '<br>';
  tooltip += t('invoice.taxtotalShort') + ': ' + moneyFormat(money.totalTax);
  tooltip += '<br>';
  tooltip += t('invoice.total') + ': ' + moneyFormat(money.total);

  const tst = props['data-tst']; //eslint-disable-line
  return (
    <Tooltip title={tooltip} mouseEnterDelay={0}>
      <div>
        <InvoiceAmountLabel invoices={invoices} data-tst={tst + '-amount'} isQuotation={false} />
        <br />
        <span data-tst={tst + '-total'}>{moneyFormat(money.total)}</span>
      </div>
    </Tooltip>
  );
};
