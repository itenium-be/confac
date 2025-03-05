import { useEffect, useState } from "react";
import { Claim } from "../../users/models/UserModel";
import { AddIcon } from "../../controls/Icon";
import { t } from "../../utils";
import { createInvoiceList, InvoiceFeatureBuilderConfig } from "../models/getInvoiceFeature";
import InvoiceModel from "../models/InvoiceModel";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { ListSelect, ListSelectionItem } from "../../controls/table/ListSelect";
import { Modal } from "../../controls/Modal";
import { SearchStringInput } from "../../controls/form-controls/inputs/SearchStringInput";
import { IFeature } from "../../controls/feature/feature-models";
import { ListFilters } from "../../controls/table/table-models";

export type InvoiceCreditNotasModalProps = {
  onConfirm: (ListSelectionItem) => void,
  model: InvoiceModel,
  config: InvoiceFeatureBuilderConfig,
  claim?: Claim,
}

export const InvoiceCreditNotasModal = ({ config, model, onConfirm, claim}: InvoiceCreditNotasModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedInvoices, setSelectedInvoices] = useState<ListSelectionItem<InvoiceModel>>(
    config.data.filter(i => model.creditNotas.includes(i.number) && !i.isQuotation)
  )

  const featureConfig: IFeature<InvoiceModel, ListFilters> = createInvoiceList({
    ...config,
    data: [...config.data.filter(i => model.number !== i.number && !i.isQuotation)],
    includedFields: [
      'number',
      'client',
      'date-full',
      'period',
      'consultant',
    ]
  });

  useEffect(() => {
    setSelectedInvoices(
        config.data.filter(i => model.creditNotas.includes(i.number) && !i.isQuotation)
    );
  }, [model.creditNotas, config.data]);



  return (
    <>
      <AddIcon claim={claim} onClick={() => {setOpen(true)}} label={t('invoice.creditNotas.addLine')} size={1} />

      {open && (
        <Modal
          show={true}
          onClose={() => setOpen(false)}
          onConfirm={() => onConfirm(selectedInvoices)}
          title={t('invoice.creditNotas.title')}
          dialogClassName="linked-invoices-modal"

        >
          <Container className={`list list-${featureConfig.key}`}>
            <Row>
              <Col sm={6}>
                <h1>
                  {featureConfig.list.listTitle ? featureConfig.list.listTitle() : t(featureConfig.trans.listTitle)}
                </h1>
              </Col>
              {featureConfig.list.filter?.fullTextSearch &&
                <Col sm={6}>
                  <SearchStringInput value={featureConfig.list.filter.state.freeText}
                    onChange={str => featureConfig.list.filter?.updateFilter({...featureConfig.list.filter.state, freeText: str})}
                  />
                </Col>
              }
            </Row>
            <ListSelect
              feature={featureConfig}
              value={selectedInvoices}
              isMulti={true}
              onChange={(selection) => setSelectedInvoices(selection)}
              listSize={10}
            />
          </Container>
        </Modal>
      )}
    </>
  );
}
