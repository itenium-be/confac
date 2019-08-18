import React from 'react';
import {t, moneyFormat} from '../../util';

const amountsStyle = {textAlign: 'right', float: 'right'};

function discountFormat(value) {
  if (!value) {
    return '';
  }
  if (value.toString().slice(-1) === '%') {
    return value;
  }
  return moneyFormat(value);
}

export const InvoicesTotal = ({invoices, totalOnly = false, ...props}) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), {totalWithoutTax: 0, totalTax: 0, total: 0});

  const tst = key => `${props['data-tst']}-${key}`;

  if (totalOnly) {
    return <span style={amountsStyle}><strong data-tst={tst('total')}>{moneyFormat(money.total)}</strong></span>;
  }

  return (
    <div>
      <div>
        {t('invoice.subtotalLong')}
        <span style={amountsStyle} data-tst={tst('totalWithoutTax')}>{moneyFormat(money.totalWithoutTax)}</span>
      </div>
      <div>
        {t('invoice.taxtotalShort')}
        <span style={amountsStyle} data-tst={tst('totalTax')}>{moneyFormat(money.totalTax)}</span>
      </div>
      <div>
        {t('invoice.total')}
        <span style={amountsStyle}><strong data-tst={tst('total')}>{moneyFormat(money.total)}</strong></span>
      </div>
    </div>
  );
};

const InvoiceTotal = ({totalWithoutTax, totalTax, total, discount, ...props}) => {
  const tst = key => `${props['data-tst']}-${key}`;
  return (
    <div>
      <div>
        {t('invoice.subtotal')}
        <span style={amountsStyle} data-tst={tst('totalWithoutTax')}>{moneyFormat(totalWithoutTax)}</span>
      </div>
      <div>
        {t('invoice.taxtotal')}
        <span style={amountsStyle} data-tst={tst('totalTax')}>{moneyFormat(totalTax)}</span>
      </div>
      {discount ? (
        <div>
          {t('invoice.discount')}
          <span style={amountsStyle} data-tst={tst('totalDiscount')}>{discountFormat(discount)}</span>
        </div>
      ) : null}
      <div>
        {t('invoice.total')}
        <span style={amountsStyle}><strong data-tst={tst('total')}>{moneyFormat(total)}</strong></span>
      </div>
    </div>
  );
};

export default InvoiceTotal;
