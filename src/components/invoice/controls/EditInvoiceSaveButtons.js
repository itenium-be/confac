import React from 'react';
import {t} from '../../util.js';
import {BusyButton} from '../../controls.js';

export const EditInvoiceSaveButtons = ({isNewInvoice, onClick}) => {
  return (
    <div className="button-row">
      <BusyButton bsStyle="default" onClick={onClick.bind(this, 'preview')} data-tst="preview" icon="fa fa-eye">
        {t('invoice.preview')}
      </BusyButton>
      <BusyButton onClick={onClick.bind(this, isNewInvoice ? 'create' : 'update')} data-tst="save" icon="fa fa-floppy-o">
        {isNewInvoice ? t('invoice.create') : t('save')}
      </BusyButton>
    </div>
  );
};
