import React from 'react';
import numeral from 'numeral';
import { t } from '../util.js';

const InvoiceTotal = ({totalWithoutTax, taxPercentage, totalTax, total}) => {
  const amountsStyle = {textAlign: 'right', float: 'right'};
  return (
    <div>
      <div>
        {t('invoice.subtotal')}
        <span style={amountsStyle}>€ {numeral(totalWithoutTax).format('0,0.00')}</span>
      </div>
      <div>
        {t('invoice.taxtotal', taxPercentage)}
        <span style={amountsStyle}>€ {numeral(totalTax).format('0,0.00')}</span>
      </div>
      <div>
        {t('invoice.total')}
        <span style={amountsStyle}><strong>€ {numeral(total).format('0,0.00')}</strong></span>
      </div>
    </div>
  );
}

export default InvoiceTotal;
