import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import {t} from '../../util.js';

import {AttachmentDownloadIcon, AddIcon} from '../../controls.js';
import {updateInvoiceAttachment} from '../../../actions/index.js';

export class InvoiceAttachmentsForm extends Component {
  static propTypes = {
    invoice: PropTypes.object.isRequired,
  }
  render() {
    const {invoice} = this.props;
    return (
      <div>
        <h4>{t('invoice.attachments')}</h4>
        {!invoice.isNew ? <AttachmentDownloadIcon invoice={invoice} /> : null}
        <AddAttachment invoice={invoice} />
      </div>
    );
  }
}


class DropzoneWrapper extends Component {
  static propTypes = {
    updateInvoiceAttachment: PropTypes.func.isRequired,
    invoice: PropTypes.object.isRequired,
  }
  constructor() {
    super();
    this.state = {isOpen: false};
  }

  onDrop(acceptedFiles, rejectedFiles) {
    this.props.updateInvoiceAttachment(this.props.invoice, 'timesheet', acceptedFiles);
    // console.log('Accepted files: ', acceptedFiles);
    // console.log('Rejected files: ', rejectedFiles);
  }

  render() {
    if (!this.state.isOpen) {
      return (
        <div>
          <AddIcon onClick={() => this.setState({isOpen: true})} label={t('invoice.attachmentsAdd')} size={1} />
        </div>
      );
    }

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

    return (
      <div>
        <Dropzone onDrop={this.onDrop.bind(this)} multiple={true} style={style}>
          <div>{t('invoice.attachmentsDropzone')}</div>
        </Dropzone>
      </div>
    );
  }
}

export const AddAttachment = connect(() => ({}), {updateInvoiceAttachment})(DropzoneWrapper);
