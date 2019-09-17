import React from "react";
import { getInvoiceDownloadUrl } from "../../../actions";
import { t } from "../../util";
import { Icon } from "../../controls/Icon";
import { InvoicePreviewIcon } from "../../controls/attachments/AttachmentDownloadIcon";

/** Invoice Download and Preview icons */
export const DownloadInvoiceButton = ({invoice}) => {
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
}
