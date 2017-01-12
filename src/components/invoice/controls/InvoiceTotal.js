import React from 'react';
import { t, moneyFormat } from '../../util.js';

const amountsStyle = {textAlign: 'right', float: 'right'};

export const InvoicesTotal = ({invoices}) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), {totalWithoutTax: 0, totalTax: 0, total: 0});

  return (
    <div>
      <div>
        {t('invoice.subtotalLong')}
        <span style={amountsStyle}>{moneyFormat(money.totalWithoutTax)}</span>
      </div>
      <div>
        {t('invoice.taxtotalShort')}
        <span style={amountsStyle}>{moneyFormat(money.totalTax)}</span>
      </div>
      <div>
        {t('invoice.total')}
        <span style={amountsStyle}><strong>{moneyFormat(money.total)}</strong></span>
      </div>
    </div>
  );
};

const InvoiceTotal = ({totalWithoutTax, taxPercentage, totalTax, total}) => {
  return (
    <div>
      <div>
        {t('invoice.subtotal')}
        <span style={amountsStyle}>{moneyFormat(totalWithoutTax)}</span>
      </div>
      <div>
        {t('invoice.taxtotal', taxPercentage)}
        <span style={amountsStyle}>{moneyFormat(totalTax)}</span>
      </div>
      <div>
        {t('invoice.total')}
        <span style={amountsStyle}><strong>{moneyFormat(total)}</strong></span>
      </div>
    </div>
  );
};

export default InvoiceTotal;
