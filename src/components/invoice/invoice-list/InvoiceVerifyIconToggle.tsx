import React from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import t from '../../../trans';
import {toggleInvoiceVerify} from '../../../actions/index';
import InvoiceModel from '../models/InvoiceModel';
import {BusyVerifyIcon} from '../../controls/icons/VerifyIcon';
import {EnhanceWithClaim, EnhanceWithClaimProps} from '../../enhancers/EnhanceWithClaim';


type InvoiceVerifyIconToggleProps = EnhanceWithClaimProps & {
  invoice: InvoiceModel,
  toggleValid?: (valid: boolean) => void;
}

export const InvoiceVerifyIconToggle = EnhanceWithClaim(({invoice, toggleValid, ...props}: InvoiceVerifyIconToggleProps) => {
  const dispatch = useDispatch();
  if (invoice.isQuotation) {
    return null;
  }

  const daysPassed = moment().diff(invoice.audit.createdOn, 'days');
  const title = invoice.verified ? t('invoice.verifyAction') : t('invoice.verifyActionTooltip', {days: daysPassed});
  return (
    <BusyVerifyIcon
      model={invoice}
      style={{marginLeft: 8}}
      onClick={() => {
        dispatch(toggleInvoiceVerify(invoice));
        if (toggleValid) {
          toggleValid(!invoice.verified);
        }
      }}
      title={title}
      {...props}
    />
  );
});
