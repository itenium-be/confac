import React from 'react';
import {useSelector} from 'react-redux';
import {getInvoiceDownloadUrl} from '../../../actions/index';
import {Attachment} from '../../../models';
import InvoiceModel from '../models/InvoiceModel';
import {AttachmentsForm} from '../../controls/attachments/AttachmentsForm';
import {ConfacState} from '../../../reducers/app-state';
import {useProjectMonthFromInvoice} from '../../hooks/useProjects';


type InvoiceAttachmentsFormProps = {
  model: InvoiceModel,
}

export const InvoiceAttachmentsForm = ({model}: InvoiceAttachmentsFormProps) => {
  const defaultInvoiceFileName = useSelector((state: ConfacState) => state.config.invoiceFileName);
  const fullProjectMonth = useProjectMonthFromInvoice(model._id);


  if (!model._id) {
    return null;
  }

  const createDownloadUrl = (
    downloadType: 'download' | 'preview', att: 'pdf' | Attachment,
  ) => getInvoiceDownloadUrl(defaultInvoiceFileName, model, att, downloadType, fullProjectMonth);

  const modelType = model.isQuotation ? 'quotation' : 'invoice';
  return (
    <AttachmentsForm
      model={model}
      modelType={modelType}
      createDownloadUrl={createDownloadUrl}
    />
  );
};
