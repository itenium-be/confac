import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Icon, SpinnerIcon} from '../../controls/Icon';
import {downloadInvoice, downloadClientAttachment, previewInvoice} from '../../../actions/index';
import t from '../../../trans';
import EditInvoiceModel, { EditInvoiceModelProps } from '../EditInvoiceModel';
import { EditClientModel } from '../../client/ClientModels';
import { Attachment } from '../../../models';
import { getAwesomeFileType } from '../models/getAwesomeFileType';



export const InvoiceDownloadIcon = ({invoice, ...props}: EditInvoiceModelProps) => (
  <AttachmentDownloadIcon
    model={invoice}
    attachment={invoice.attachments.find(a => a.type === 'pdf')}
    modelType={invoice.isQuotation ? 'quotation' : 'invoice'}
    actionType="download"
    {...props}
  />
);


export const InvoicePreviewIcon = ({invoice, ...props}: EditInvoiceModelProps) => (
  <AttachmentDownloadIcon
    model={invoice}
    attachment={invoice.attachments.find(a => a.type === 'pdf')}
    modelType={invoice.isQuotation ? 'quotation' : 'invoice'}
    actionType="preview"
    {...props}
  />
);




type AttachmentDownloadIconProps = {
  previewInvoice: Function,
  'data-tst': string,
  model: EditInvoiceModel | EditClientModel,
  attachment: Attachment,
  modelType: 'invoice' | 'client' | 'quotation',
  actionType: 'download' | 'preview',
  label: string,
}

type AttachmentDownloadIconState = {
  isBusy: boolean,
}


class AttachmentDownloadIconComponent extends Component<AttachmentDownloadIconProps, AttachmentDownloadIconState> {
  constructor(props: AttachmentDownloadIconProps) {
    super(props);
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
