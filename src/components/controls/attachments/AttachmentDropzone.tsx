import React from 'react';
import {useDropzone} from 'react-dropzone';

import {Icon} from '../Icon';
import {t} from '../../utils';


export type AttachmentDropzoneProps = {
  onUpload: (file: File) => void,
  children?: React.ReactNode;
  className?: string | null;
  disabled?: boolean;
  fileType?: string;
  disableOpacityMode?: boolean;
  dropzonePlaceholderText?: string;
}

/**
 * DO NOT USE:
 * A low level component that should not be used directly
 * It is for example not possible to delete the document.
 *
 * See: GenericAttachmentDropzone
 **/
export const AttachmentDropzone = (props: AttachmentDropzoneProps) => {
  const {onUpload, children, className, disabled, fileType, disableOpacityMode = false, dropzonePlaceholderText} = props;

  const onDrop = (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;
    onUpload(file);
  };
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({onDrop});

  const file = !!acceptedFiles.length && acceptedFiles[0];

  const styles = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    // eslint-disable-next-line no-nested-ternary
    opacity: disableOpacityMode ? 1 : (file ? 1 : 0.5),
  };

  return (
    <div {...getRootProps()} style={styles} className={className === undefined ? 'attachment' : ''}>
      <input {...getInputProps()} multiple={false} className="tst-dropzone" disabled={disabled} />
      {children || (
        <>
          <div className="icon">
            <Icon fa="fa fa-file-upload" style={{marginRight: 8}} />
          </div>
          {file ? (
            <div className="info">
              {fileType}
              <span className="fileName">{file.name}</span>
            </div>
          ) : (
            <span>{dropzonePlaceholderText || t('invoice.attachmentsProposed', {type: fileType})}</span>
          )}
        </>
      )}
    </div>
  );
};
