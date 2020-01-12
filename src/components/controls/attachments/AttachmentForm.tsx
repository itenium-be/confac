import React from 'react';
import {IAttachment, Attachment} from '../../../models';
import {AttachmentDownloadIcon, getAttachmentDownloadUrl} from '../../controls';

type AttachmentFormProps = {
  attachment: Attachment,
  model: IAttachment,
  modelType: 'invoice' | 'client' | 'quotation',
  children?: any
}

export const AttachmentForm = ({model, modelType, attachment, children}: AttachmentFormProps) => (
  <div className="attachment">
    <div className="icon">
      <AttachmentDownloadIcon
        model={model}
        attachment={attachment}
        modelType={modelType}
        data-tst={`att-download-${attachment.type}`}
      />
    </div>
    <div className="info">
      {attachment.type}
      <a href={getAttachmentDownloadUrl(model, attachment, modelType)} className="fileName">
        {attachment.fileName}
      </a>
    </div>
    {children}
  </div>
);
