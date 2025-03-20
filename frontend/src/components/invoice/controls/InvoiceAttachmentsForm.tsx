import {useSelector} from 'react-redux';
import {getInvoiceDownloadUrl} from '../../../actions/index';
import {Attachment} from '../../../models';
import InvoiceModel from '../models/InvoiceModel';
import {AttachmentsForm} from '../../controls/attachments/AttachmentsForm';
import {ConfacState} from '../../../reducers/app-state';


type InvoiceAttachmentsFormProps = {
  model: InvoiceModel,
}

export const InvoiceAttachmentsForm = ({model}: InvoiceAttachmentsFormProps) => {
  const defaultInvoiceFileName = useSelector((state: ConfacState) => state.config.invoiceFileName);

  if (!model._id) {
    return null;
  }

  const createDownloadUrl = (
    downloadType: 'download' | 'preview', att: 'pdf' | Attachment,
  ) => getInvoiceDownloadUrl(defaultInvoiceFileName, model, att, downloadType);

  const modelType = model.isQuotation ? 'quotation' : 'invoice';
  return (
    <AttachmentsForm
      model={model}
      modelType={modelType}
      createDownloadUrl={createDownloadUrl}
    />
  );
};
