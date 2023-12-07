import React from 'react';
import {Button} from '../../controls/form-controls/Button';


type AttachmentPreviewButtonProps = {
  downloadUrl: string;
  /** Specifies translation key for the tooltip  */
  tooltip: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const AttachmentPreviewButton = ({downloadUrl, tooltip, disabled, style}: AttachmentPreviewButtonProps) => {
  const viewAttachment = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <Button
      onClick={() => viewAttachment()}
      className="tst-view-attachment"
      variant="outline-dark"
      disabled={disabled}
      style={style}
      title={disabled ? undefined : tooltip}
      icon="fa fa-eye"
    />
  );
};
