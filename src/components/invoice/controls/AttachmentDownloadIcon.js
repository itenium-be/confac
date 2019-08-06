import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Icon, SpinnerIcon} from '../../controls/Icon.js';
import {downloadInvoice, downloadClientAttachment, previewInvoice} from '../../../actions/index.js';
import t from '../../../trans.js';

export const InvoiceDownloadIcon = ({invoice, ...props}) => (
  <AttachmentDownloadIcon
    model={invoice}
    attachment={invoice.attachments.find(a => a.type === 'pdf')}
    modelType={invoice.isQuotation ? 'quotation' : 'invoice'}
    actionType="download"
    {...props}
  />
);


export const InvoicePreviewIcon = ({invoice, ...props}) => (
  <AttachmentDownloadIcon
    model={invoice}
    attachment={invoice.attachments.find(a => a.type === 'pdf')}
    modelType={invoice.isQuotation ? 'quotation' : 'invoice'}
    actionType="preview"
    {...props}
  />
);


class AttachmentDownloadIconComponent extends Component {
  static propTypes = {
    previewInvoice: PropTypes.func.isRequired,
    'data-tst': PropTypes.string.isRequired,
    model: PropTypes.object.isRequired,
    attachment: PropTypes.shape({
      type: PropTypes.string.isRequired,
      fileName: PropTypes.string,
      fileType: PropTypes.string,
      lastModifiedDate: PropTypes.string,
    }),
    modelType: PropTypes.oneOf(['invoice', 'client', 'quotation']).isRequired,
    actionType: PropTypes.oneOf(['download', 'preview']).isRequired,
    label: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {isBusy: false};
  }

  render() {
    const {model, attachment, modelType, actionType, previewInvoice, ...props} = this.props;

    let fileType, onClick, attTitle;
    if (actionType === 'download') {
      fileType = getAwesomeFileType(attachment);
      attTitle = t('invoice.downloadAttachment', {type: attachment.fileName || attachment.type});
      onClick = () => {
        this.setState({isBusy: true});
        const downloader = modelType === 'client' ? downloadClientAttachment : downloadInvoice;
        downloader(model, attachment).then(() => this.setState({isBusy: false}));
        this.setState({isBusy: false});
      };

    } else if (actionType === 'preview') {
      fileType = 'fa-eye';
      attTitle = t(modelType + '.viewPdf');
      onClick = () => {
        previewInvoice(model);
      };
    }

    if (this.state.isBusy) {
      const offset = attachment.type === 'pdf' ? -12 : 0;
      return <SpinnerIcon style={{marginLeft: offset}} data-tst={this.props['data-tst']} />;
    }

    return (
      <Icon
        fa={`fa ${fileType} fa-2x`}
        title={attTitle}
        {...props}
        onClick={onClick}
        color={this.state.isBusy ? '#DCDAD1' : undefined}
        label={this.props.label}
        labelStyle={{fontSize: 16}}
      />
    );
  }
}

export const AttachmentDownloadIcon = connect(undefined, {previewInvoice})(AttachmentDownloadIconComponent);


function getAwesomeFileType(att) {
  if (att.type === 'pdf' || att.fileType === 'application/pdf') {
    return 'fa-file-pdf-o';
  }

  // file-code-o, file-audio-o
  // extension = att.fileName.substring(att.fileName.lastIndexOf('.') + 1)
  // console.log(att.type, ':', att.fileType);


  const type = att.fileType;
  if (type.startsWith('image/')) {
    return 'fa-file-image-o';
  }

  if (type === 'text/plain') {
    return 'fa-file-text-o';
  }

  switch (type) {
  case 'application/vnd.oasis.opendocument.spreadsheet':
    return 'fa-file-excel-o';
  case 'application/vnd.oasis.opendocument.text':
    return 'fa-file-word-o';
  case 'application/vnd.oasis.opendocument.presentation':
    return 'fa-file-powerpoint-o';


  case 'application/x-rar-compressed':
  case 'application/x-7z-compressed':
  case 'application/x-bzip2':
  case 'application/x-tar':
  case 'application/x-gtar':
  case 'application/zip':
  case 'application/x-zip-compressed':
    return 'fa fa-file-archive-o';

  default:
  }

  if (type === 'application/octet-stream') {
    const ext = att.fileName.substring(att.fileName.lastIndexOf('.') + 1);
    switch (ext) {
    case 'xls':
    case 'xlsx':
    case 'ods':
      return 'fa-file-excel-o';

    case 'doc':
    case 'docx':
    case 'odt':
      return 'fa-file-word-o';

    case 'zip':
    case '7z':
    case 'tar':
    case 'bz2':
    case 'gz':
    case 'rar':
      return 'fa fa-file-archive-o';

    case 'ppt':
    case 'pptx':
    case 'odp':
      return 'fa-file-powerpoint-o';

    default:
      return 'fa-file-o';
    }
  }

  return 'fa-file-o';
}
