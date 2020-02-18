import React from 'react';

import {Button} from '../../controls/form-controls/Button';
import {Icon} from '../../controls/Icon';
import {t} from '../../utils';


type AttachmentPreviewButtonProps = {
  downloadUrl: string;
  /** Specifies translation key for the tooltip  */
  tooltip: string;
}

export const AttachmentPreviewButton = (props: AttachmentPreviewButtonProps) => {
  const viewAttachment = () => {
    window.open(props.downloadUrl, '_blank');
  };

  return (
    <Button size="md" onClick={() => viewAttachment()} variant="outline-dark">
      <Icon fa="fa fa-eye" size={1} title={t(props.tooltip)} />
    </Button>
  );
};
