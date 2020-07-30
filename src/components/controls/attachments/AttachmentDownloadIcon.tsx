import React from 'react';
import {useSelector} from 'react-redux';
import {Icon, IconProps} from '../Icon';
import {getInvoiceDownloadUrl} from '../../../actions/index';
import t from '../../../trans';
import {InvoiceModelProps} from '../../invoice/models/InvoiceModel';
import {Attachment} from '../../../models';
import {getAwesomeFileType} from '../../invoice/models/getAwesomeFileType';
import {ConfacState} from '../../../reducers/app-state';
import {useProjectMonthFromInvoice} from '../../hooks/useProjects';


export const InvoiceDownloadIcon = ({invoice, ...props}: InvoiceModelProps) => {
  const configInvoiceFileName = useSelector((state: ConfacState) => state.config.invoiceFileName);
  const fullProjectMonth = useProjectMonthFromInvoice(invoice._id);

  const defaultInvoiceFileName = invoice.client.invoiceFileName || configInvoiceFileName;
  return (
    <AttachmentDownloadIcon
      downloadUrl={getInvoiceDownloadUrl(defaultInvoiceFileName, invoice, 'pdf', 'download', fullProjectMonth)}
      attachment={invoice.attachments.find(a => a.type === 'pdf')}
      {...props}
    />
  );
};


export const InvoicePreviewIcon = ({invoice, ...props}: InvoiceModelProps & IconProps) => {
  const configInvoiceFileName = useSelector((state: ConfacState) => state.config.invoiceFileName);
  const fullProjectMonth = useProjectMonthFromInvoice(invoice._id);

  const defaultInvoiceFileName = invoice.client.invoiceFileName || configInvoiceFileName;
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  return (
    <Icon
      title={t(`${fileType}.viewPdf`)}
      href={getInvoiceDownloadUrl(defaultInvoiceFileName, invoice, 'pdf', undefined, fullProjectMonth)}
      fa="far fa-eye"
      {...props}
    />
  );
};


type AttachmentPreviewIconProps = {
  attachment: Attachment,
  previewUrl: string,
  title?: string,
}

export const AttachmentPreviewIcon = ({previewUrl, attachment, ...props}: AttachmentPreviewIconProps) => (
  <Icon title={t(props.title || 'invoice.viewPdf')} href={previewUrl} size={1} fa="far fa-eye" {...props} />
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
