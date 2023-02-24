import React from 'react';
import {useDispatch} from 'react-redux';
import {Attachment} from '../../../models';
import {AttachmentDownloadIcon, AttachmentPreviewIcon} from './AttachmentDownloadIcon';
import {t} from '../../utils';
import {AttachmentDropzone} from './AttachmentDropzone';
import {ConfirmedDeleteIcon} from '../icons/DeleteIcon';
import {AttachmentFormContext, deleteGenericAttachment, updateGenericAttachment} from '../../../actions';
import {buildUrl} from '../../../actions/utils/buildUrl';
import {authService} from '../../users/authService';


import './attachments.scss';



type AttachmentFormProps = {
  /** Context for building backend URIs */
  context: AttachmentFormContext;
  /** Actual attachment, if present */
  attachment?: Attachment;
  dropzonePlaceholderText?: string;
  viewFileTooltip?: string;
}


/**
 * Attachment Dropzone for one File
 * Includes preview and delete actions
 */
export const GenericAttachmentDropzone = (props: AttachmentFormProps) => {
  const dispatch = useDispatch();
  const {modelType, id} = props.context;
  const attachmentType = props.context.attachmentType;
  const encodedFileName = encodeURIComponent(props.attachment?.fileName || '');
  const token = `?token=${authService.getTokenString()}`;
  const previewUrl = buildUrl(`/attachments/${modelType}/${id}/${attachmentType}/${encodedFileName}${token}`);
  const downloadUrl = previewUrl + '&download=1';

  if (!props.attachment) {
    return (
      <div style={{minWidth: '20%'}}>
        <AttachmentDropzone
          onUpload={(file: File) => dispatch(updateGenericAttachment(props.context, file) as any)}
          dropzonePlaceholderText={props.dropzonePlaceholderText}
        />
      </div>
    );
  }

  return (
    <div style={{minWidth: '20%'}}>
      <div className="attachment">
        <div className="icon">
          <AttachmentDownloadIcon
            attachment={props.attachment}
            downloadUrl={downloadUrl}
          />
        </div>
        <div className="info">
          {props.attachment.type}
          <a href={downloadUrl} className="fileName">
            {props.attachment.fileName}
          </a>
        </div>
        <div className="attachment-actions">
          <ConfirmedDeleteIcon
            title={t('attachment.deleteTitle')}
            onClick={() => dispatch(deleteGenericAttachment(props.context) as any)}
            size={1}
          >
            {t('attachment.deletePopup')}
          </ConfirmedDeleteIcon>
          <AttachmentPreviewIcon
            attachment={props.attachment}
            previewUrl={previewUrl}
            title={props.viewFileTooltip}
          />
        </div>
      </div>
    </div>
  );
};
