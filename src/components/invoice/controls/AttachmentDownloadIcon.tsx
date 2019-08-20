import React from 'react';
import {Icon} from '../../controls/Icon';
import { getInvoiceDownloadUrl, getClientDownloadUrl} from '../../../actions/index';
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
    {...props}
  />
);


export const InvoicePreviewIcon = ({invoice, ...props}: EditInvoiceModelProps) => {
  const fileType = invoice.isQuotation ? 'quotation' : 'invoice';
  return <Icon title={t(fileType + '.viewPdf')} href={getInvoiceDownloadUrl(invoice, 'pdf')} fa="fa fa-eye" {...props} />;
};




type AttachmentDownloadIconProps = {
  'data-tst': string,
  model: EditInvoiceModel | EditClientModel,
  attachment: Attachment,
  modelType: 'invoice' | 'client' | 'quotation',
  label: string,
}


export const AttachmentDownloadIcon = ({model, attachment, modelType, ...props}: AttachmentDownloadIconProps) => {
  let href;
  if (modelType === 'client') {
    href = getClientDownloadUrl(model, attachment);
  } else {
    href = getInvoiceDownloadUrl(model, attachment.type, 'download');
  }

  return (
    <Icon
      fa={`fa ${getAwesomeFileType(attachment)} fa-2x`}
      title={t('invoice.downloadAttachment', {type: attachment.fileName || attachment.type})}
      {...props}
      href={href}
      labelStyle={{fontSize: 16}}
    />
  );
}
