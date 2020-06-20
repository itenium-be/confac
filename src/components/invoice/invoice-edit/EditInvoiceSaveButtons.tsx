import React from 'react';
import {withRouter} from 'react-router-dom';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {BusyButton} from '../../controls/form-controls/BusyButton';

type RoutedProps = EditInvoiceSaveButtonsComponentProps & {
  match: any,
  location: any,
  history: any,
  staticContext: any,
}

export const EditInvoiceSaveButtons = withRouter(({match, location, history, staticContext, ...props}: RoutedProps) => (
  <EditInvoiceSaveButtonsComponent history={history} {...props} />
));




type EditInvoiceSaveButtonsComponentProps = {
  history: any,
  invoice: InvoiceModel,
  onClick: (type: 'create' | 'update' | 'preview', history: any) => void,
}

export const EditInvoiceSaveButtonsComponent = ({history, invoice, onClick}: EditInvoiceSaveButtonsComponentProps) => {
  const isNewInvoice = invoice.isNew;
  const tp = (transKey: string): string => t(invoice.getType() + transKey);
  return (
    <>
      <BusyButton variant="light" onClick={() => onClick('preview', history)} icon="far fa-eye">
        {t('invoice.preview')}
      </BusyButton>
      <BusyButton onClick={() => onClick(isNewInvoice ? 'create' : 'update', history)}>
        {isNewInvoice ? tp('.create') : t('save')}
      </BusyButton>
    </>
  );
};
