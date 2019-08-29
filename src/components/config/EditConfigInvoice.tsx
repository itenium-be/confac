import { Row, Col } from "react-bootstrap";
import React from "react";
import { t } from "../util";
import * as Control from "../controls";

// export const


export const EditConfigInvoice = ({config, onChange}) => (
  <Row>
    <h1>{t('config.invoiceTitle')}</h1>
    <Col sm={4}>
      <Control.ClientSelect
        label={t('config.defaultClient')}
        value={config.defaultClient}
        onChange={item => onChange({defaultClient: item ? item._id : null})}
        data-tst="config.defaultClient"
      />
    </Col>

    <Col sm={4}>
      <Control.StringInput
        label={t('config.defaultTax')}
        value={config.defaultTax}
        onChange={value => onChange({defaultTax: value})}
        suffix="%"
        data-tst="config.defaultTax"
      />
    </Col>

    <Col sm={4}>
      <Control.StringsSelect
        label={t('attachment.types')}
        values={config.attachmentTypes}
        onChange={values => onChange({attachmentTypes: values})}
        data-tst="config.attachmentTypes"
      />
    </Col>

    <Col sm={4}>
      <Control.InvoiceLineTypeSelect
        label={t('config.defaultInvoiceLineType')}
        type={config.defaultInvoiceLineType}
        onChange={value => onChange({defaultInvoiceLineType: value})}
        data-tst="config.defaultInvoiceLineType"
      />
    </Col>

    <Col sm={4}>
      <Control.InvoiceDateStrategySelect
        value={config.defaultInvoiceDateStrategy}
        data-tst="config.defaultInvoiceDateStrategy"
        onChange={value => onChange({defaultInvoiceDateStrategy: value})}
      />
    </Col>
  </Row>
);
