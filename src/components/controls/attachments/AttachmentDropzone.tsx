import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

import {Icon} from '../Icon';
import {t} from '../../utils';


export type AttachmentDropzoneProps = {
  onUpload: (file: File) => void,
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  fileType?: string;
}

export const AttachmentDropzone = ({onUpload, children, className, disabled, fileType}: AttachmentDropzoneProps) => {
  const onDrop = useCallback(acceptedFiles => {
    const [file] = acceptedFiles;
    onUpload(file);
  }, []);
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({onDrop});

  const file = !!acceptedFiles.length && acceptedFiles[0];

  return (
    <div {...getRootProps()} style={{cursor: disabled ? 'not-allowed' : 'pointer'}} className={className}>
      <input {...getInputProps()} multiple={false} className="tst-dropzone" disabled={disabled} />
      {children || (
        <>
          <div className="icon">
            <Icon fa="fa fa-file-upload" style={{marginRight: 8}} />
          </div>
          {
          file ? (
            <div className="info">
              {fileType}
              <span className="fileName">{file.name}</span>
            </div>
          ) : (
            <span style={{paddingBottom: 5}}>{t('invoice.attachmentsProposed', {type: fileType})}</span>
          )
        }
        </>
      )}
    </div>
  );
};
