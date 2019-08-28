import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { t } from '../../util';


export type AttachmentDropzoneProps = {
  onAdd: Function,
}


export class AttachmentDropzone extends Component<AttachmentDropzoneProps> {
  onDrop(acceptedFiles, rejectedFiles) {
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
    };
    return (<div>
      <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} style={style} className="tst-dropzone">
        <div>{t('invoice.attachmentsDropzone')}</div>
      </Dropzone>
    </div>);
  }
}
