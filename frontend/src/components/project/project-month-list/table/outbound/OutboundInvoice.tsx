import { moneyFormat, formatDate } from '../../../../utils';
import { InvoiceNumberCell } from '../../../../invoice/invoice-table/InvoiceNumberCell';
import { InvoiceListRowActions } from '../../../../invoice/invoice-table/InvoiceListRowActions';
import { InvoiceEmail } from './InvoiceEmail';
import InvoiceModel from '../../../../invoice/models/InvoiceModel';
import { CSSProperties } from 'react';

interface OutboundInvoiceProps {
  invoice: InvoiceModel;
  toggleValid: (valid: boolean) => void;
  className?: string;
  style?: CSSProperties
}


export const OutboundInvoice = ({ invoice, toggleValid, className, style }: OutboundInvoiceProps) => {
  return (
    <div className={`outbound-invoice-cell ${className || ''}`} style={style}>
      <div>
        <span style={{ whiteSpace: 'nowrap' }}>{moneyFormat(invoice.money.total)}</span>
        <span>
          <InvoiceNumberCell invoice={invoice} />
          &nbsp;({formatDate(invoice.date, 'D/M')})
        </span>
      </div>
      <div className="email">
        <InvoiceEmail invoice={invoice} />
      </div>
      <div className="icons-cell">
        <InvoiceListRowActions invoice={invoice} toggleValid={toggleValid} small buttons={['validate', 'preview']} />
      </div>
    </div>
  );
};
