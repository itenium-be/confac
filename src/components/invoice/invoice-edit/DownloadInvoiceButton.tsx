import React from 'react';
import {getInvoiceDownloadUrl} from '../../../actions';
import {t} from '../../utils';
import {Icon} from '../../controls/Icon';
import {InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import InvoiceModel from '../models/InvoiceModel';

type DownloadInvoiceButtonProps = {
  invoice: InvoiceModel;
}

/** Invoice Download and Preview icons */
export const DownloadInvoiceButton = ({invoice}: DownloadInvoiceButtonProps) => {
  const downloadUrl = getInvoiceDownloadUrl(invoice, 'pdf', 'download');
  return (
    <div className="attachment">
      <div style={{marginLeft: 3}}>
        <Icon
          fa="fa fa-file-invoice"
          style={{color: '#0062cc', marginRight: 20}}
          title={t('invoice.downloadInvoice')}
          href={downloadUrl}
          size={1}
        />
        <InvoicePreviewIcon invoice={invoice} size={1} color="#EEB4B4" />
      </div>
    </div>
  );
};
