import React from 'react';
import {useSelector} from 'react-redux';
import {getInvoiceDownloadUrl} from '../../../actions/index';
import {Attachment} from '../../../models';
import InvoiceModel from '../models/InvoiceModel';
import {AttachmentsForm} from '../../controls/attachments/AttachmentsForm';
import {ConfacState} from '../../../reducers/app-state';
import {projectMonthResolve} from '../../project/ProjectMonthsLists';

type InvoiceAttachmentsFormProps = {
  model: InvoiceModel,
}

export const InvoiceAttachmentsForm = ({model}: InvoiceAttachmentsFormProps) => {
  const fullProjectMonth = useSelector((state: ConfacState) => state.projectsMonth
    .map(pm => projectMonthResolve(pm, state))
    .find(x => x.invoice && x.invoice._id === model._id));

  const modelType = model.isQuotation ? 'quotation' : 'invoice';

  if (!model._id) return null;

  const createDownloadUrl = (
    downloadType: 'download' | 'preview', att: 'pdf' | Attachment,
  ) => getInvoiceDownloadUrl(model, att, downloadType, fullProjectMonth);

  return (
    <AttachmentsForm
      model={model}
      modelType={modelType}
      createDownloadUrl={createDownloadUrl}
    />
  );
};
