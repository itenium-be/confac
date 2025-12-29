import {useDispatch} from 'react-redux';
import moment from 'moment';
import t from '../../../trans';
import {toggleInvoiceVerify} from '../../../actions/index';
import InvoiceModel from '../models/InvoiceModel';
import {BusyInvoiceStatusIcon} from '../../controls/icons/InvoiceStatusIcon';
import {EnhanceWithClaim, EnhanceWithClaimProps} from '../../enhancers/EnhanceWithClaim';


type InvoiceVerifyIconToggleProps = EnhanceWithClaimProps & {
  invoice: InvoiceModel;
  toggleBusy?: boolean;
}

export const InvoiceVerifyIconToggle = EnhanceWithClaim(({invoice, toggleBusy, ...props}: InvoiceVerifyIconToggleProps) => {
  const dispatch = useDispatch();
  if (invoice.isQuotation) {
    return null;
  }

  const daysPassed = moment().diff(invoice.audit.createdOn, 'days');
  const title = invoice.status === 'Paid' ? t('invoice.unverifyActionTooltip') : t('invoice.verifyActionTooltip', {days: daysPassed});
  console.log('InvoiceVerifyIconToggle', invoice);
  return (
    <BusyInvoiceStatusIcon
      withoutStoreBusy={!toggleBusy}
      model={invoice}
      style={{marginLeft: 8}}
      onClick={() => dispatch(toggleInvoiceVerify(invoice, toggleBusy) as any)}
      title={title}
      {...props}
    />
  );
});
