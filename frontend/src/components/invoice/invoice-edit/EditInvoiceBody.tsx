import { Col } from "react-bootstrap"
import InvoiceModel from "../models/InvoiceModel"
import { EditInvoiceClient } from "./EditInvoiceClient"
import { Row } from "react-bootstrap"
import { EditInvoiceDetails } from "./EditInvoiceDetails"
import { ProjectMonthOrManualSelect } from "../../project/controls/ProjectMonthOrManualSelect"
import { EditInvoiceLines } from "./invoice-lines/EditInvoiceLines"
import { Claim } from "../../users/models/UserModel"
import { InvoiceCreditNotas } from "../controls/InvoiceCreditNotas"
import { InvoiceAttachmentsForm } from "../controls/InvoiceAttachmentsForm"

export type EditInvoiceBodyProps = {
  invoice: InvoiceModel,
  onChange: (invoice: InvoiceModel) => void
}
export const EditInvoiceBody = ({invoice, onChange}: EditInvoiceBodyProps) => {

  return (
    <>
      <Row>
        <Col sm={6}>
          <EditInvoiceClient
            invoice={invoice}
            onChange={val => {
              invoice.setClient(val)
              onChange(invoice)
            }}
          />
        </Col>

        <Col sm={6}>
          <Row>
            <EditInvoiceDetails
              invoice={invoice}
              onChange={(fieldName: string, value: any) => {
                invoice.updateField(fieldName, value, true);
                onChange(invoice)
              }}
            />
          </Row>
          <Row>
            <ProjectMonthOrManualSelect
              value={invoice.projectMonth}
              onProjectMonthChange={fpm => {
                invoice.setProjectMonth(fpm);
                onChange(invoice)
              }}
              onManualChange={(consultant, month) => {
                invoice.setManualProjectMonth(consultant, month || undefined);
                onChange(invoice)
              }}
              invoice={invoice}
            />
          </Row>
        </Col>
      </Row>
      <Row style={{marginTop: 8}}>
          <EditInvoiceLines
            claim={invoice.isQuotation ? Claim.ManageQuotations : Claim.ManageInvoices}
            value={invoice.lines}
            onChange={m => {
              invoice.setLines(m);
              onChange(invoice)
            }}
            translationPrefix={invoice.getType()}
          />
        </Row>
        <Row>
          <InvoiceCreditNotas
            model={invoice}
            onChange={m => {
              onChange(invoice)
            }}
          />
        </Row>
        <InvoiceAttachmentsForm model={invoice} />

    </>
  )
}
