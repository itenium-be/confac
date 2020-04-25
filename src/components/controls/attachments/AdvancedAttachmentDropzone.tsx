import React from 'react';
import {Attachment} from '../../../models';
import {AttachmentDownloadIcon, AttachmentPreviewIcon} from './AttachmentDownloadIcon';
import {t} from '../../utils';
import {AttachmentDropzone} from './AttachmentDropzone';
import {ConfirmedDeleteIcon} from '../icons/DeleteIcon';


import './attachments.scss';


type AttachmentFormProps = {
  attachment?: Attachment;
  downloadUrl: (downloadType: 'download' | 'preview', att: Attachment) => string;
  onDelete?: Function;
  onUpload?: (file: File) => void;
  dropzonePlaceholderText?: string;
}

export const AdvancedAttachmentDropzone = (
  {dropzonePlaceholderText, attachment, downloadUrl, onDelete, onUpload}:AttachmentFormProps,
) => (
  <div style={{minWidth: '20%'}}>
    {
      attachment && (
        <div className="attachment">
          <div className="icon">
            <AttachmentDownloadIcon
              attachment={attachment}
              downloadUrl={downloadUrl('download', attachment)}
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
    <AttachmentDropzone onUpload={onUpload} className="attachment" dropzonePlaceholderText={dropzonePlaceholderText} />
    )}
  </div>
);
