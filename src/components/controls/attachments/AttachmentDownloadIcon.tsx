import React from 'react';
import {Icon, IconProps} from '../Icon';
import { getInvoiceDownloadUrl, getClientDownloadUrl} from '../../../actions/index';
import t from '../../../trans';
import InvoiceModel, { InvoiceModelProps } from '../../invoice/models/InvoiceModel';
import { ClientModel } from '../../client/models/ClientModels';
import { Attachment, IAttachment } from '../../../models';
import { getAwesomeFileType } from '../../invoice/models/getAwesomeFileType';


export const InvoiceDownloadIcon = ({invoice, ...props}: InvoiceModelProps) => (
  <AttachmentDownloadIcon
    model={invoice}
    attachment={invoice.attachments.find(a => a.type === 'pdf') as Attachment}
    modelType={invoice.isQuotation ? 'quotation' : 'invoice'}
    {...props}
  />
);


export const InvoicePreviewIcon = ({invoice, ...props}: InvoiceModelProps & IconProps) => {
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  return <Icon title={t(fileType + '.viewPdf')} href={getInvoiceDownloadUrl(invoice, 'pdf')} fa="far fa-eye" {...props} />;
};




type AttachmentDownloadIconProps = IconProps & {
  model: IAttachment,
  attachment: Attachment,
  modelType: 'invoice' | 'client' | 'quotation',
}


export const getAttachmentDownloadUrl = (model: IAttachment, attachment: Attachment, modelType: 'client' | 'invoice' | 'quotation'): string => {
  if (modelType === 'client') {
    return getClientDownloadUrl(model as ClientModel, attachment);
  } else {
    return getInvoiceDownloadUrl(model as InvoiceModel, attachment, 'download');
  }
}

export const AttachmentDownloadIcon = ({model, attachment, modelType, ...props}: AttachmentDownloadIconProps) => {
  const href = getAttachmentDownloadUrl(model, attachment, modelType);

  return (
    <Icon
      fa={`${getAwesomeFileType(attachment)} fa-2x`}
      title={t('invoice.downloadAttachment', {type: attachment.fileName || attachment.type})}
      {...props}
      href={href}
      labelStyle={{fontSize: 16}}
    />
  );
}
