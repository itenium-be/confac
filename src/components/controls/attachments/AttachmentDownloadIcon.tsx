import React from 'react';
import {useSelector} from 'react-redux';
import {Icon, IconProps} from '../Icon';
import {getInvoiceDownloadUrl} from '../../../actions/index';
import t from '../../../trans';
import {InvoiceModelProps} from '../../invoice/models/InvoiceModel';
import {Attachment} from '../../../models';
import {getAwesomeFileType} from '../../invoice/models/getAwesomeFileType';
import {ConfacState} from '../../../reducers/app-state';
import {projectMonthResolve} from '../../project/ProjectMonthsLists';


export const InvoiceDownloadIcon = ({invoice, ...props}: InvoiceModelProps) => {
  const fullProjectMonth = useSelector((state: ConfacState) => state.projectsMonth
    .map(pm => projectMonthResolve(pm, state))
    .find(x => x.invoice && x.invoice._id === invoice._id));

  return (
    <AttachmentDownloadIcon
      downloadUrl={getInvoiceDownloadUrl(invoice, 'pdf', 'download', fullProjectMonth)}
      attachment={invoice.attachments.find(a => a.type === 'pdf')}
      {...props}
    />
  );
};


export const InvoicePreviewIcon = ({invoice, ...props}: InvoiceModelProps & IconProps) => {
  const fullProjectMonth = useSelector((state: ConfacState) => state.projectsMonth
    .map(pm => projectMonthResolve(pm, state))
    .find(x => x.invoice && x.invoice._id === invoice._id));

  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  return (
    <Icon
      title={t(`${fileType}.viewPdf`)}
      href={getInvoiceDownloadUrl(invoice, 'pdf', undefined, fullProjectMonth)}
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
