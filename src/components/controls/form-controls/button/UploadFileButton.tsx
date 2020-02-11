import React from 'react';
import Dropzone from 'react-dropzone';
import {Icon} from '../../Icon';
import {Button} from '../Button';


type UploadFileButtonProps = {
  onUpload: (f: File) => void;
  icon: string;
  title: string;
};



export const UploadFileButton = ({onUpload, title, icon}: UploadFileButtonProps) => (
  <>
    <Dropzone
      onDrop={(accepted: File[], rejected: File[]) => onUpload(accepted[0])}
      multiple={false}
      style={{display: 'inline'}}
    >
      <Button size="md" onClick={() => {}} variant="outline-dark">
        <Icon fa={icon} size={1} title={title} />
      </Button>
    </Dropzone>
  </>
);
