import React from 'react';
import {Icon} from '../../Icon';
import {Button} from '../Button';
import {AttachmentDropzone} from '../../attachments/AttachmentDropzone';


type UploadFileButtonProps = {
  onUpload: (f: File) => void;
  title: string;
  buttonText?: string;
  disabled?: boolean;
  hasFile?: boolean;
};



export const UploadFileButton = ({onUpload, title, buttonText, disabled, hasFile}: UploadFileButtonProps) => (
  <AttachmentDropzone onUpload={onUpload} disabled={disabled} disableOpacityMode>
    <Button size="md" onClick={() => {}} variant={hasFile ? 'outline-dark' : 'outline-secondary'} disabled={disabled} title={title}>
      <Icon fa="fa fa-upload" size={1} />
      {buttonText && <span style={{marginLeft: 10}}>{buttonText}</span>}
    </Button>
  </AttachmentDropzone>
);
