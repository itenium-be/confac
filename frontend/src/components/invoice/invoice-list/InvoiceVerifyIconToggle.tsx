import {CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import t from '../../../trans';
import {toggleInvoiceVerify} from '../../../actions/index';
import InvoiceModel from '../models/InvoiceModel';
import {BusyInvoiceStatusIcon, InvoiceStatusIcon, getInvoiceStatusTooltip} from '../../controls/icons/InvoiceStatusIcon';
import {EnhanceWithClaim, EnhanceWithClaimProps} from '../../enhancers/EnhanceWithClaim';
import {ConfacState} from '../../../reducers/app-state';


type InvoiceVerifyIconToggleProps = EnhanceWithClaimProps & {
  invoice: InvoiceModel;
  toggleBusy?: boolean;
}

export const InvoiceVerifyIconToggle = EnhanceWithClaim(({invoice, toggleBusy, ...props}: InvoiceVerifyIconToggleProps) => {
  const dispatch = useDispatch();
  const config = useSelector((state: ConfacState) => state.config);
  if (invoice.isQuotation) {
    return null;
  }

  const isClickable = invoice.status === 'ToPay' || invoice.status === 'Paid';
  const daysPassed = moment().diff(invoice.audit.createdOn, 'days');
  const isBeforePeppolPivot = invoice.audit?.createdOn
    ? moment(invoice.audit.createdOn).isBefore(config.peppolPivotDate, 'day')
    : false;

  let style: CSSProperties = {marginLeft: 8};
  if (invoice.status === 'Draft') {
    style = {marginLeft: 10, marginRight: 4};
  }

  if (isClickable) {
    // For clickable icons, add the "click to mark" action text to tooltip
    const title = getInvoiceStatusTooltip(invoice.status, invoice.billit, {daysPassed, showClickAction: true, isBeforePeppolPivot});
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
      invoice={invoice}
      style={{...style, opacity: 0.2}}
      {...props}
    />
  );
});
