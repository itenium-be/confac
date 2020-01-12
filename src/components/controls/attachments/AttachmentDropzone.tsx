import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import {t} from '../../utils';


export type AttachmentDropzoneProps = {
  onAdd: (file: File) => void,
}


export class AttachmentDropzone extends Component<AttachmentDropzoneProps> {
  onDrop(acceptedFiles: File[], rejectedFiles: File[]) {
    this.props.onAdd(acceptedFiles[0]);
    // console.log('Accepted files: ', acceptedFiles);
    // console.log('Rejected files: ', rejectedFiles);
  }

  render() {
    const style = {
      width: 250,
      height: 55,
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'dashed',
      borderRadius: 5,
      padding: 5,
      marginTop: 7,
      cursor: 'pointer',
    };
    return (
      <div>
        <Dropzone onDrop={(acc, rej) => this.onDrop(acc, rej)} multiple={false} style={style} className="tst-dropzone">
          <div>{t('invoice.attachmentsDropzone')}</div>
        </Dropzone>
      </div>
    );
  }
}
