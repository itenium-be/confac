import {ClientModel} from '../models/ClientModels';
import {Attachment} from '../../../models';
import {AttachmentsForm} from '../../controls/attachments/AttachmentsForm';
import {getClientDownloadUrl} from '../../../actions/downloadActions';

type ClientAttachmentsFormProps = {
  model: ClientModel,
}

export const ClientAttachmentsForm = (props: ClientAttachmentsFormProps) => {
  const {model} = props;
  const modelType = 'client';

  if (!model._id) return null;

  const createDownloadUrl = (downloadType: 'download' | 'preview', att: Attachment) => getClientDownloadUrl(model, att, downloadType);

  return (
    <AttachmentsForm
      model={model}
      modelType={modelType}
      createDownloadUrl={createDownloadUrl}
    />
  );
};
