import React from "react";
import { getInvoiceDownloadUrl } from "../../../actions";
import { t } from "../../util";
import { Icon } from "../../controls/Icon";

export const DownloadInvoiceButton = ({invoice}) => {
  const donwloadUrl = getInvoiceDownloadUrl(invoice, 'pdf', 'download');
  return (
    <div className="attachment">
      <div className="icon" style={{marginLeft: 3}}>
        <Icon
          fa="fa fa-file-invoice"
          style={{color: '#0062cc'}}
          title={t('invoice.downloadInvoice')}
          href={donwloadUrl}
          size={1}
        />
      </div>
    </div>
  );
}
