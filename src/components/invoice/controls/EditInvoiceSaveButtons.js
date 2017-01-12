import React from 'react';
import { t } from '../../util.js';
import { BusyButton } from '../../controls.js';

export const EditInvoiceSaveButtons = ({isNewInvoice, onClick}) => {
  if (isNewInvoice) {
    return (
      <div className="button-row">
        <BusyButton bsStyle="default" onClick={onClick.bind(this, 'preview')}>
          {t('invoice.preview')}
        </BusyButton>
        <BusyButton onClick={onClick.bind(this, 'create')}>{t('invoice.create')}</BusyButton>
      </div>
    );
  }

  return (
    <div className="button-row">
      <BusyButton bsStyle="default" onClick={onClick.bind(this, 'update-pdf')}>
        {t('invoice.updatePdf')}
      </BusyButton>
      <BusyButton onClick={onClick.bind(this, 'update')}>{t('save')}</BusyButton>
    </div>
  );
};
