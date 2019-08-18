import React from 'react';
import {t} from '../../util';
import {BusyButton} from '../../controls';
import {withRouter} from 'react-router-dom';

export const EditInvoiceSaveButtons = withRouter(({ match, location, history, staticContext, ...props }) => (
  <EditInvoiceSaveButtonsComponent history={history} {...props} />
));


export const EditInvoiceSaveButtonsComponent = ({history, invoice, onClick}) => {
  const isNewInvoice = invoice.isNew;
  const tp = transKey => t(invoice.getType() + transKey);
  return (
    <div className="button-row">
      <BusyButton variant="default" onClick={onClick.bind(this, 'preview', history)} data-tst="preview" icon="fa fa-eye">
        {t('invoice.preview')}
      </BusyButton>
      <BusyButton onClick={onClick.bind(this, isNewInvoice ? 'create' : 'update', history)} data-tst="save" icon="fa fa-floppy-o">
        {isNewInvoice ? tp('.create') : t('save')}
      </BusyButton>
    </div>
  );
};
