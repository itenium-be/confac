import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {Alert} from 'react-bootstrap';
import {t} from '../../utils';
import {toggleInvoiceVerify} from '../../../actions/index';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {NotEmailedIcon, NotPeppoledIcon} from '../../controls/Icon';
import {BusyButton} from '../../controls/form-controls/BusyButton';
import {getInvoiceDueDateVariant} from '../invoice-table/getInvoiceListRowClass';
import {Claim} from '../../users/models/UserModel';


type InvoiceNotVerifiedAlertProps = {
  invoice: InvoiceModel;
}

const InvoiceNotVerifiedAlert = ({invoice}: InvoiceNotVerifiedAlertProps) => {
  const dispatch = useDispatch();
  const invoicePayDays = useSelector((state: ConfacState) => state.config.invoicePayDays);
  const peppolPivotDate = useSelector((state: ConfacState) => state.config.peppolPivotDate);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || invoice.isNew || ['Paid', 'Draft', 'ToSend'].includes(invoice.status) || invoice.isQuotation) {
    return null;
  }

  const variant = getInvoiceDueDateVariant(invoice, invoicePayDays) as any;
  const daysOpen = moment().diff(invoice.audit.createdOn, 'days');

  return (
    <div>
      <Alert variant={variant} onClose={() => setDismissed(true)} dismissible>

        {!invoice.lastEmail && (
          moment(invoice.audit?.createdOn).isSameOrAfter(peppolPivotDate, 'day')
            ? <NotPeppoledIcon style={{marginRight: 10, fontSize: 13, marginTop: -6}} />
            : <NotEmailedIcon style={{marginRight: 10, fontSize: 13, marginTop: -6}} />
        )}

        <BusyButton
          claim={Claim.ValidateInvoices}
          variant={variant}
          onClick={() => dispatch(toggleInvoiceVerify(invoice) as any)}
          size="sm"
          style={{marginTop: -5, marginRight: 10, textTransform: 'uppercase'}}
          className="tst-verify-invoice"
        >
          {t('invoice.verifyAction')}
        </BusyButton>

        {t('invoice.isNotVerified')}

        <small style={{marginLeft: 6}}>
          {t('invoice.notVerifiedFor', {days: daysOpen})}
          {invoice.lastEmail && (
            <>
              {' '}
              {moment(invoice.audit?.createdOn).isSameOrAfter(peppolPivotDate, 'day')
                ? t('email.lastPeppolDaysAgo', {daysAgo: moment(invoice.lastEmail).fromNow()})
                : t('email.lastEmailDaysAgo', {daysAgo: moment(invoice.lastEmail).fromNow()})}
            </>
          )}
        </small>

      </Alert>
    </div>
  );
};

export default InvoiceNotVerifiedAlert;
