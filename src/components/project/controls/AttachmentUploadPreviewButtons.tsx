import React from 'react';
import {ButtonGroup} from 'react-bootstrap';

import {AttachmentPreviewButton} from './AttachmentPreviewButton';
import {UploadFileButton} from '../../controls/form-controls/button/UploadFileButton';

type AttachmentUploadPreviewButtonsProps = {
  isUploadDisabled: boolean;
  isPreviewDisabled: boolean;
  uploadTooltip: string;
  previewTooltip: string;
  onUpload: (f: File) => Function;
  downloadUrl: string;
}

export const AttachmentUploadPreviewButtons = (props: AttachmentUploadPreviewButtonsProps) => {
  const {isUploadDisabled, isPreviewDisabled, uploadTooltip, previewTooltip, onUpload, downloadUrl} = props;

  return (
    <ButtonGroup>
      <UploadFileButton
        onUpload={onUpload}
        title={uploadTooltip}
        icon="fa fa-upload"
        disabled={isUploadDisabled}
      />
      <AttachmentPreviewButton downloadUrl={downloadUrl} tooltip={previewTooltip} disabled={isPreviewDisabled} />
    </ButtonGroup>
  );
};
