import React from 'react';

import {Attachment} from '../../../models';
import {AttachmentDownloadIcon, AttachmentPreviewIcon} from './AttachmentDownloadIcon';
import {ConfirmedDeleteIcon, Icon} from '../Icon';
import {t} from '../../utils';
import {AttachmentDropzone} from './AttachmentDropzone';
import './attachments.scss';

type AttachmentFormProps = {
  attachment?: Attachment;
  downloadUrl: (downloadType: 'download' | 'preview', att: Attachment) => string;
  onDelete?: Function;
  onUpload?: (file: File) => void;
  dropzoneText?: string;
}

export const AdvancedAttachmentDropzone = (
  {dropzoneText, attachment, downloadUrl, onDelete, onUpload}:AttachmentFormProps,
) => (
  <div style={{minWidth: '20%'}}>
    {
      attachment && (
        <div className="attachment">
          <div className="icon">
            <AttachmentDownloadIcon
              attachment={attachment}
              downloadUrl={downloadUrl('download', attachment)}
              data-tst={`att-download-${attachment.type}`}
            />
          </div>
          <div className="info">
            {attachment.type}
            <a href={downloadUrl('download', attachment)} className="fileName">
              {attachment.fileName}
            </a>
          </div>
          <div className="attachment-actions">
            {onDelete && (
            <ConfirmedDeleteIcon
              title={t('attachment.deleteTitle')}
              onClick={() => onDelete(attachment)}
              data-tst={`att-delete-${attachment.type}`}
              size={1}
            >
              {t('attachment.deletePopup')}
            </ConfirmedDeleteIcon>
            )}
            <AttachmentPreviewIcon attachment={attachment} previewUrl={downloadUrl('preview', attachment)} />
          </div>
        </div>
      )
    }
    {!attachment && onUpload && (
    <AttachmentDropzone onUpload={onUpload} className="attachment">
      <Icon fa="fa fa-file-upload" style={{marginRight: 8}} />
      <span style={{paddingBottom: 5}}>{dropzoneText || t('attachment.upload')}</span>
    </AttachmentDropzone>
    )}
  </div>
);
