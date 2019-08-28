import React from "react";
import { Row, Col } from "react-bootstrap";
import { t } from "../util";
import * as Control from "../controls";

export const EditConfigExtraFields = ({config, onChange}) => (
  <>
    <Row>
      <h1>{t('config.extraFields.title')}</h1>
      <Col sm={4}>
        <Control.PropertiesSelect
          label={t('config.extraFields.config')}
          values={config.extraConfigFields}
          onChange={value => onChange({extraConfigFields: value})}
          data-tst="config.extraFields.title"
        />
      </Col>
      <Col sm={4}>
        <Control.PropertiesSelect
          label={t('config.extraFields.client')}
          values={config.defaultExtraClientFields}
          onChange={value => onChange({defaultExtraClientFields: value})}
          data-tst="config.extraFields.client"
        />
      </Col>
      <Col sm={4}>
        <Control.PropertiesSelect
          label={t('config.extraFields.clientInvoice')}
          values={config.defaultExtraClientInvoiceFields}
          onChange={value => onChange({defaultExtraClientInvoiceFields: value})}
          data-tst="config.extraFields.clientInvoice"
        />
      </Col>
    </Row>
    <Row>
      <Control.ExtraFieldsInput
        properties={config.extraConfigFields}
        onChange={value => onChange({extraConfigFields: value})}
        data-tst="config.extraConfigFields"
      />
    </Row>
  </>
);
