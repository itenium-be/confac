import React from 'react';

import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';


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
    <Button size="md" onClick={() => viewAttachment()} variant="outline-dark" disabled={disabled} style={style}>
      <Icon fa="fa fa-eye" size={1} title={tooltip} />
    </Button>
  );
};
