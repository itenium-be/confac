import { Col } from "react-bootstrap";
import InvoiceModel from "../models/InvoiceModel";
import { Audit } from "../../admin/audit/Audit";
import { EditInvoiceBadges } from "./EditInvoiceBadges";
import { NotesWithCommentsModalButton } from "../../controls/form-controls/button/NotesWithCommentsModalButton";
import { Claim } from "../../users/models/UserModel";
import { DownloadInvoiceButton } from "./DownloadInvoiceButton";
import { InvoiceDownloadIcon } from "../../controls/attachments/AttachmentDownloadIcon";
import InvoiceNotVerifiedAlert from "./InvoiceNotVerifiedAlert";
import { t } from "../../utils";

export type EditInvoiceHeaderProps = {
  invoice: InvoiceModel,
  isNew: boolean,
  onChange: (invoice: InvoiceModel) => void;
}
export const EditInvoiceHeader = ({invoice, isNew, onChange} : EditInvoiceHeaderProps) => {
  const type: 'quotation' | 'invoice' = invoice.isQuotation ? 'quotation' : 'invoice';
  return (
    <>
      <Col sm={12} style={{marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'inline-flex', alignItems: 'flex-start'}}>
          <h1 style={{width: 'unset'}}>
            {!isNew ? t(`${type}.editTitle`) : t(`${type}.createTitle`)}
            <Audit model={invoice} modelType="invoice" />
          </h1>
          <div>
            <EditInvoiceBadges invoice={invoice} />
          </div>
        </div>
        {!isNew && (
          <div>
            <div className="invoice-top-buttonbar invoice-edit">
              <NotesWithCommentsModalButton
                claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
                value={{note: invoice.note, comments: invoice.comments || []}}
                onChange={val => onChange(new InvoiceModel(invoice.config, {...invoice, note: val.note, comments: val.comments}))}
                title={t('projectMonth.note')}
                variant="link"
              />
              <DownloadInvoiceButton invoice={invoice} />
              {!invoice?.isQuotation && <InvoiceDownloadIcon invoice={invoice} fileType='xml' style={{color: '#0062cc', marginLeft: 20}} />}
            </div>
          </div>
        )}
      </Col>
      <Col sm={12}>
        <InvoiceNotVerifiedAlert invoice={invoice} />
      </Col>
    </>
  )
}
