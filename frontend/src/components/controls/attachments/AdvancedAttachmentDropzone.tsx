import {Attachment} from '../../../models';
import {AttachmentDownloadIcon, AttachmentPreviewIcon} from './AttachmentDownloadIcon';
import {t} from '../../utils';
import {AttachmentDropzone} from './AttachmentDropzone';
import {ConfirmedDeleteIcon} from '../icons/DeleteIcon';
import {Claim} from '../../users/models/UserModel';


import './attachments.scss';


type AttachmentFormProps = {
  attachment?: Attachment;
  downloadUrl: (downloadType: 'download' | 'preview', att: Attachment) => string;
  onDelete?: Function;
  onUpload?: (file: File) => void;
  dropzonePlaceholderText?: string;
  viewFileTooltip?: string;
  claim: Claim;
}

/**
 * DO NOT USE:
 * Overly complex...
 *
 * See: GenericAttachmentDropzone
 */
export const AdvancedAttachmentDropzone = (
  {claim, dropzonePlaceholderText, attachment, downloadUrl, onDelete, onUpload, viewFileTooltip}: AttachmentFormProps,
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
                claim={claim}
                title={t('attachment.deleteTitle')}
                onClick={() => onDelete(attachment)}
                size={1}
              >
                {t('attachment.deletePopup')}
              </ConfirmedDeleteIcon>
            )}
            <AttachmentPreviewIcon
              attachment={attachment}
              previewUrl={downloadUrl('preview', attachment)}
              title={viewFileTooltip}
            />
          </div>
        </div>
      )
    }
    {!attachment && onUpload && (
      <AttachmentDropzone onUpload={onUpload} dropzonePlaceholderText={dropzonePlaceholderText} />
    )}
  </div>
);
