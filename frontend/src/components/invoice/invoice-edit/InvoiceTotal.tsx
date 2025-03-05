import {CSSProperties} from 'react';
import {t, moneyFormat} from '../../utils';
import InvoiceModel, {InvoiceMoney} from '../models/InvoiceModel';

const amountsStyle: CSSProperties = {textAlign: 'right', float: 'right'};

function discountFormat(value: string | number): string {
  if (!value) {
    return '';
  }
  if (value.toString().slice(-1) === '%') {
    return value.toString();
  }
  return moneyFormat(value);
}

/**
 * Shows money totals of x invoices
 * Show: total OR totalWithoutTax + totalTax + total
 */
export const InvoicesTotal = ({invoices, totalOnly = false, ...props}: { invoices: InvoiceModel[], totalOnly?: boolean }) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), {totalWithoutTax: 0, totalTax: 0, total: 0});


  if (totalOnly) {
    return (
      <div>
        {t('invoice.total')}
        <span style={amountsStyle}><strong>{moneyFormat(money.total)}</strong></span>
      </div>
    );
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



/**
 * Show moneys of one InvoiceModel: Subtotal, taxtotal, (optional) discount, total
 */
const InvoiceTotal = ({totalWithoutTax, totalTax, total, discount, ...props}: InvoiceMoney) => (
  <div>
    <div>
      {t('invoice.subtotal')}
      <span style={amountsStyle}>{moneyFormat(totalWithoutTax)}</span>
    </div>
    <div>
      {t('invoice.taxtotal')}
      <span style={amountsStyle}>{moneyFormat(totalTax)}</span>
    </div>
    {discount ? (
      <div>
        {t('invoice.discount')}
        <span style={amountsStyle}>{discountFormat(discount)}</span>
      </div>
    ) : null}
    <div>
      {t('invoice.total')}
      <span style={amountsStyle}><strong>{moneyFormat(total)}</strong></span>
    </div>
  </div>
);

export default InvoiceTotal;
