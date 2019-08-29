import React from 'react';
import {t} from '../../util';
import {BusyButton} from '../../controls';
import {withRouter} from 'react-router-dom';
import EditInvoiceModel from '../models/EditInvoiceModel';

type RoutedProps = EditInvoiceSaveButtonsComponentProps & {
  match: any,
  location: any,
  history: any,
  staticContext: any,
}

export const EditInvoiceSaveButtons = withRouter(({ match, location, history, staticContext, ...props }: RoutedProps) => (
  <EditInvoiceSaveButtonsComponent history={history} {...props} />
));




type EditInvoiceSaveButtonsComponentProps = {
  history: any,
  invoice: EditInvoiceModel,
  onClick: any,
}

export const EditInvoiceSaveButtonsComponent = ({history, invoice, onClick}: EditInvoiceSaveButtonsComponentProps) => {
  const isNewInvoice = invoice.isNew;
  const tp = (transKey: string): string => t(invoice.getType() + transKey);
  return (
    <div className="button-row">
      <BusyButton variant="light" onClick={onClick.bind(null, 'preview', history)} data-tst="preview" icon="far fa-eye">
        {t('invoice.preview')}
      </BusyButton>
      <BusyButton onClick={onClick.bind(null, isNewInvoice ? 'create' : 'update', history)} data-tst="save" icon="fa fa-floppy-o">
        {isNewInvoice ? tp('.create') : t('save')}
      </BusyButton>
    </div>
  );
};
