import React from 'react';
import {getInvoiceDownloadUrl} from '../../../actions';
import {t} from '../../utils';
import {Icon} from '../../controls/Icon';
import {InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import InvoiceModel from '../models/InvoiceModel';
import {invoiceReplacements} from '../invoice-replacements';

type DownloadInvoiceButtonProps = {
  invoice: InvoiceModel;
}

/** Invoice Download and Preview icons */
export const DownloadInvoiceButton = ({invoice}: DownloadInvoiceButtonProps) => {
  const downloadUrl = getInvoiceDownloadUrl(invoice, 'pdf', 'download');
  return (
    <div className="attachment">
      <Icon
        fa="fa fa-file-invoice"
        style={{color: '#0062cc', marginRight: 20}}
        title={t('invoice.downloadInvoice', {fileName: invoiceReplacements(invoice.fileName, invoice)})}
        href={downloadUrl}
        size={2}
      />
      <InvoicePreviewIcon invoice={invoice} size={2} color="#EEB4B4" />
    </div>
  );
};
