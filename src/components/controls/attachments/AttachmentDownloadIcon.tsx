import React from 'react';
import {Icon, IconProps} from '../Icon';
import {getInvoiceDownloadUrl} from '../../../actions/index';
import t from '../../../trans';
import {InvoiceModelProps} from '../../invoice/models/InvoiceModel';
import {Attachment} from '../../../models';
import {getAwesomeFileType} from '../../invoice/models/getAwesomeFileType';


export const InvoiceDownloadIcon = ({invoice, ...props}: InvoiceModelProps) => (
  <AttachmentDownloadIcon
    downloadUrl={getInvoiceDownloadUrl(invoice, 'pdf', 'download')}
    attachment={invoice.attachments.find(a => a.type === 'pdf')}
    {...props}
  />
);


export const InvoicePreviewIcon = ({invoice, ...props}: InvoiceModelProps & IconProps) => {
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  return <Icon title={t(`${fileType}.viewPdf`)} href={getInvoiceDownloadUrl(invoice, 'pdf')} fa="far fa-eye" {...props} />;
};


type AttachmentPreviewIconProps = {
  attachment: Attachment,
  previewUrl: string,
}

export const AttachmentPreviewIcon = ({previewUrl, attachment, ...props}: AttachmentPreviewIconProps) => (
  <Icon title={t('invoice.viewPdf')} href={previewUrl} size={1} fa="far fa-eye" {...props} />
);


type AttachmentDownloadIconProps = IconProps & {
  attachment: Attachment | undefined,
  downloadUrl: string;
}

export const AttachmentDownloadIcon = ({downloadUrl, attachment, ...props}: AttachmentDownloadIconProps) => (
  <Icon
    fa={`${getAwesomeFileType(attachment)} fa-2x`}
    title={t('invoice.downloadAttachment', attachment && {type: attachment.fileName || attachment.type})}
    {...props}
    href={downloadUrl}
    labelStyle={{fontSize: 16}}
  />
);
