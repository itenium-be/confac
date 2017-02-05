import React from 'react';
import {t, moneyFormat} from '../../util.js';

const amountsStyle = {textAlign: 'right', float: 'right'};

export const InvoicesTotal = ({invoices, totalOnly = false}) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), {totalWithoutTax: 0, totalTax: 0, total: 0});

  if (totalOnly) {
    return <span style={amountsStyle}><strong>{moneyFormat(money.total)}</strong></span>;
  }

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

const InvoiceTotal = ({totalWithoutTax, totalTax, total}) => {
  return (
    <div>
      <div>
        {t('invoice.subtotal')}
        <span style={amountsStyle}>{moneyFormat(totalWithoutTax)}</span>
      </div>
      <div>
        {t('invoice.taxtotal')}
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
