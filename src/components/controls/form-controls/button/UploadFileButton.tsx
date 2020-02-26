import React from 'react';
import {Icon} from '../../Icon';
import {Button} from '../Button';
import {AttachmentDropzone} from '../../attachments/AttachmentDropzone';


type UploadFileButtonProps = {
  onUpload: (f: File) => void;
  icon: string;
  title: string;
  buttonText?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
};



export const UploadFileButton = ({onUpload, title, icon, buttonText, disabled, style}: UploadFileButtonProps) => (
  <>
    <AttachmentDropzone onUpload={onUpload} disabled={disabled}>
      <Button size="md" onClick={() => {}} variant="outline-dark" style={style} disabled={disabled}>
        <Icon fa={icon} size={1} title={title} />
        {buttonText && <span style={{marginLeft: '10px'}}>{buttonText}</span>}
      </Button>
    </AttachmentDropzone>
  </>
);
