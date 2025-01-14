import { FullProjectMonthModel } from '../../../models/FullProjectMonthModel';
import { moneyFormat, formatDate } from '../../../../utils';
import { InvoiceNumberCell } from '../../../../invoice/invoice-table/InvoiceNumberCell';
import { InvoiceListRowActions } from '../../../../invoice/invoice-table/InvoiceListRowActions';
import { InvoiceEmail } from './InvoiceEmail';

interface OutboundInvoiceProps {
  fullProjectMonth: FullProjectMonthModel;
  toggleValid: (valid: boolean) => void;
}


export const OutboundInvoice = ({ fullProjectMonth, toggleValid }: OutboundInvoiceProps) => {
  if (!fullProjectMonth.invoice) {
    return null;
  }

  return (
    <div className="outbound-invoice-cell">
      <div>
        <span style={{ whiteSpace: 'nowrap' }}>{moneyFormat(fullProjectMonth.invoice.money.total)}</span>
        <span>
          <InvoiceNumberCell invoice={fullProjectMonth.invoice} />
          &nbsp;({formatDate(fullProjectMonth.invoice.date, 'D/M')})
        </span>
      </div>
      <div className="email">
        <InvoiceEmail invoice={fullProjectMonth.invoice} />
      </div>
      <div className="icons-cell">
        <InvoiceListRowActions invoice={fullProjectMonth.invoice} toggleValid={toggleValid} small />
      </div>
    </div>
  );
};
