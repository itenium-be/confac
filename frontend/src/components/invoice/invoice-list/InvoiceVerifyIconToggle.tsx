import {CSSProperties} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import t from '../../../trans';
import {toggleInvoiceVerify} from '../../../actions/index';
import InvoiceModel from '../models/InvoiceModel';
import {BusyInvoiceStatusIcon, InvoiceStatusIcon} from '../../controls/icons/InvoiceStatusIcon';
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

  const isClickable = invoice.status === 'ToPay' || invoice.status === 'Paid';
  const daysPassed = moment().diff(invoice.audit.createdOn, 'days');

  let title: string;
  let style: CSSProperties = {marginLeft: 8};
  if (invoice.status === 'Paid') {
    title = t('invoice.unverifyActionTooltip');
  } else if (invoice.status === 'ToPay') {
    title = t('invoice.verifyActionTooltip', {days: daysPassed});
  } else {
    title = t(`invoice.status.${invoice.status}`);
    style = invoice.status === 'Draft' ? {marginLeft: 10, marginRight: 4} : {marginLeft: 8};
  }

  if (isClickable) {
    return (
      <BusyInvoiceStatusIcon
        withoutStoreBusy={!toggleBusy}
        model={invoice}
        style={{...style, cursor: 'pointer'}}
        onClick={() => dispatch(toggleInvoiceVerify(invoice, toggleBusy) as any)}
        title={title}
        {...props}
      />
    );
  }

  return (
    <InvoiceStatusIcon
      status={invoice.status}
      style={{...style, opacity: 0.2}}
      title={title}
      {...props}
    />
  );
});
