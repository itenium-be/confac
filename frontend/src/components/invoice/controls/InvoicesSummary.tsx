import {Tooltip} from '../../controls/Tooltip';
import {t, moneyFormat} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';

type InvoiceAmountLabelProps = {
  invoices: InvoiceModel[];
  isQuotation: boolean;
}

export const InvoiceAmountLabel = ({invoices, isQuotation, ...props}: InvoiceAmountLabelProps) => {
  const type = isQuotation ? 'quotation' : 'invoice';
  if (invoices.length === 1) {
    return <span>{t(type + '.amountOne')}</span>; //eslint-disable-line
  }
  return <span>{invoices.length} {t(type + '.amount').toLowerCase()}</span>; //eslint-disable-line
};


type InvoicesSummaryProps = {
  invoices: InvoiceModel[];
}


export const InvoicesSummary = ({invoices, ...props}: InvoicesSummaryProps) => {
  const moneys = invoices.map(i => i.money);
  const money = moneys.reduce((a, b) => ({
    totalWithoutTax: a.totalWithoutTax + b.totalWithoutTax,
    totalTax: a.totalTax + b.totalTax,
    total: a.total + b.total,
  }), {totalWithoutTax: 0, totalTax: 0, total: 0});

  if (money.total === 0) {
    return null;
  }

  let tooltip = `${t('invoice.subtotal')}: ${moneyFormat(money.totalWithoutTax)}`;
  tooltip += '<br>';
  tooltip += `${t('invoice.taxtotalShort')}: ${moneyFormat(money.totalTax)}`;
  tooltip += '<br>';
  tooltip += `${t('invoice.total')}: ${moneyFormat(money.total)}`;

  return (
    <Tooltip title={tooltip} mouseEnterDelay={0}>
      <div>
        <InvoiceAmountLabel invoices={invoices} isQuotation={false} />
        <br />
        <span>{moneyFormat(money.total)}</span>
      </div>
    </Tooltip>
  );
};
