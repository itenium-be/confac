import React from 'react';

import {getInvoiceDownloadUrl} from '../../../actions/index';
import {Attachment} from '../../../models';
import InvoiceModel from '../models/InvoiceModel';
import {AttachmentsForm} from '../../controls/attachments/AttachmentsForm';

type InvoiceAttachmentsFormProps = {
  model: InvoiceModel,
}

export const InvoiceAttachmentsForm = (props: InvoiceAttachmentsFormProps) => {
  const {model} = props;
  const modelType = props.model.isQuotation ? 'quotation' : 'invoice';

  if (!model._id) return null;

  const createDownloadUrl = (
    downloadType: 'download' | 'preview', att: 'pdf' | Attachment,
  ) => getInvoiceDownloadUrl(model, att, downloadType);

  return (
    <AttachmentsForm
      model={model}
      modelType={modelType}
      createDownloadUrl={createDownloadUrl}
    />
  );
};
