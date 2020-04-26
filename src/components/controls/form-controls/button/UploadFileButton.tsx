import React from 'react';
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
    <Button
      onClick={() => {}}
      variant={hasFile || disabled ? 'outline-dark' : 'outline-warning'}
      disabled={disabled}
      title={disabled ? undefined : title}
      icon="fa fa-upload"
    >
      {buttonText && <span style={{marginLeft: 10}}>{buttonText}</span>}
    </Button>
  </AttachmentDropzone>
);
