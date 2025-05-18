import { moneyFormat, formatDate } from '../../../../utils';
import { InvoiceNumberCell } from '../../../../invoice/invoice-table/InvoiceNumberCell';
import { InvoiceListRowActions } from '../../../../invoice/invoice-table/InvoiceListRowActions';
import { InvoiceEmail } from './InvoiceEmail';
import InvoiceModel from '../../../../invoice/models/InvoiceModel';

interface OutboundInvoiceProps {
  invoice: InvoiceModel;
  className?: string;
  style?: React.CSSProperties;
}


export const OutboundInvoice = ({ invoice, className, style }: OutboundInvoiceProps) => {
  return (
    <div className={`outbound-invoice-cell ${className || ''}`} style={style}>
      <div>
        <span style={{whiteSpace: 'nowrap'}}>{moneyFormat(invoice.money.total)}</span>
        <span>
          <InvoiceNumberCell invoice={invoice} />
          &nbsp;({formatDate(invoice.date, 'D/M')})
        </span>
      </div>
      <div className="email">
        <InvoiceEmail invoice={invoice} />
      </div>
      <div className="icons-cell">
        <InvoiceListRowActions invoice={invoice} small buttons={['validate', 'preview']} toggleBusy={false} />
      </div>
    </div>
  );
};
