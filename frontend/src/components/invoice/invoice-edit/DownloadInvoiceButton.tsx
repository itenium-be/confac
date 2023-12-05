import React from 'react';
import {useSelector} from 'react-redux';
import {getInvoiceDownloadUrl} from '../../../actions';
import {t} from '../../utils';
import {Icon} from '../../controls/Icon';
import {InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import InvoiceModel from '../models/InvoiceModel';
import {invoiceReplacements} from '../invoice-replacements';
import {ConfacState} from '../../../reducers/app-state';
import {useProjectMonthFromInvoice} from '../../hooks/useProjects';


type DownloadInvoiceButtonProps = {
  invoice: InvoiceModel;
}

/** Invoice Download and Preview icons */
export const DownloadInvoiceButton = ({invoice}: DownloadInvoiceButtonProps) => {
  const defaultInvoiceFileName = useSelector((state: ConfacState) => state.config.invoiceFileName);
  const fullProjectMonth = useProjectMonthFromInvoice(invoice._id);

  const invoiceFileName = invoice.client.invoiceFileName || defaultInvoiceFileName;
  const downloadUrl = getInvoiceDownloadUrl(invoiceFileName, invoice, 'pdf', 'download', fullProjectMonth);
  return (
    <>
      <Icon
        fa="fa fa-file-invoice"
        style={{color: '#0062cc', marginRight: 20}}
        title={t('invoice.downloadInvoice', {fileName: invoiceReplacements(invoiceFileName, invoice, fullProjectMonth)})}
        href={downloadUrl}
        size={2}
        className="tst-icon-invoice"
      />
      <InvoicePreviewIcon invoice={invoice} size={2} color="#EEB4B4" />
    </>
  );
};
