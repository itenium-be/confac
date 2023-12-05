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
  <AttachmentDropzone className={null} onUpload={onUpload} disabled={disabled} disableOpacityMode>
    <Button
      onClick={() => {}}
      variant="outline-dark"
      disabled={disabled}
      title={disabled ? undefined : title}
      icon="fa fa-upload"
      style={hasFile ? {borderTopRightRadius: 0, borderBottomRightRadius: 0} : undefined}
      className="tst-btn-upload"
    >
      {buttonText && <span style={{marginLeft: 10}}>{buttonText}</span>}
    </Button>
  </AttachmentDropzone>
);
