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

  const uploadButton = (
    <UploadFileButton
      onUpload={onUpload}
      title={uploadTooltip}
      disabled={isUploadDisabled}
      hasFile={!isPreviewDisabled}
    />
  );

  const previewButton = (
    <AttachmentPreviewButton downloadUrl={downloadUrl} tooltip={previewTooltip} disabled={isPreviewDisabled} />
  );

  if (isUploadDisabled) {
    return <div className="single-button">{previewButton}</div>;
  }

  if (isPreviewDisabled) {
    return <div className="single-button">{uploadButton}</div>;
  }

  return (
    <ButtonGroup>
      {uploadButton}
      {previewButton}
    </ButtonGroup>
  );
};
