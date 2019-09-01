import React from "react";
import { getInvoiceDownloadUrl } from "../../../actions";
import { t } from "../../util";
import { Icon } from "../../controls/Icon";

export const DownloadOrPreviewInvoiceButtons = ({invoice}) => {
  const donwloadUrl = getInvoiceDownloadUrl(invoice, 'pdf', 'download');
  return (
    <div className="attachment">
      <div className="icon">
        <Icon
          fa="fa fa-file-invoice"
          title={t('invoice.downloadInvoice')}
          href={donwloadUrl}
          size={1}
        />
      </div>
    </div>
  );
}
