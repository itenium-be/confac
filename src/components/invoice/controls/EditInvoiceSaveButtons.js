import React from 'react';
import {t} from '../../util.js';
import {BusyButton} from '../../controls.js';

export const EditInvoiceSaveButtons = ({isNewInvoice, onClick}) => {
  if (isNewInvoice) {
    return (
      <div className="button-row">
        <BusyButton bsStyle="default" onClick={onClick.bind(this, 'preview')} data-tst="preview" icon="fa fa-eye">
          {t('invoice.preview')}
        </BusyButton>
        <BusyButton onClick={onClick.bind(this, 'create')} data-tst="save" icon="fa fa-floppy-o">
          {t('invoice.create')}
        </BusyButton>
      </div>
    );
  }

  return (
    <div className="button-row">
      <BusyButton bsStyle="default" onClick={onClick.bind(this, 'update-pdf')} data-tst="update-pdf">
        {t('invoice.updatePdf')}
      </BusyButton>
      <BusyButton onClick={onClick.bind(this, 'update')} data-tst="save" icon="fa fa-floppy-o">
        {t('save')}
      </BusyButton>
    </div>
  );
};
