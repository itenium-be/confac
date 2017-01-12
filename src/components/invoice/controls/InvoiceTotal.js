import React from 'react';
import { t, moneyFormat } from '../../util.js';

const InvoiceTotal = ({totalWithoutTax, taxPercentage, totalTax, total}) => {
  const amountsStyle = {textAlign: 'right', float: 'right'};
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
