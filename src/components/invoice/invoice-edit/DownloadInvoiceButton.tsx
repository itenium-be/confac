import React from 'react';
import {useSelector} from 'react-redux';
import {getInvoiceDownloadUrl} from '../../../actions';
import {t} from '../../utils';
import {Icon} from '../../controls/Icon';
import {InvoicePreviewIcon} from '../../controls/attachments/AttachmentDownloadIcon';
import InvoiceModel from '../models/InvoiceModel';
import {invoiceReplacements} from '../invoice-replacements';
import {ConfacState} from '../../../reducers/app-state';
import {projectMonthResolve} from '../../project/ProjectMonthsLists';

type DownloadInvoiceButtonProps = {
  invoice: InvoiceModel;
}

/** Invoice Download and Preview icons */
export const DownloadInvoiceButton = ({invoice}: DownloadInvoiceButtonProps) => {
  const fullProjectMonth = useSelector((state: ConfacState) => state.projectsMonth
    .map(pm => projectMonthResolve(pm, state))
    .find(x => x.invoice && x.invoice._id === invoice._id));

  const downloadUrl = getInvoiceDownloadUrl(invoice, 'pdf', 'download', fullProjectMonth);
  return (
    <>
      <Icon
        fa="fa fa-file-invoice"
        style={{color: '#0062cc', marginRight: 20}}
        title={t('invoice.downloadInvoice', {fileName: invoiceReplacements(invoice.fileName, invoice, fullProjectMonth)})}
        href={downloadUrl}
        size={2}
      />
      <InvoicePreviewIcon invoice={invoice} size={2} color="#EEB4B4" />
    </>
  );
};
