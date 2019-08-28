import React from "react";
import { Row, Col } from "react-bootstrap";
import { t } from "../util";
import { StringInput, PropertiesSelect, ExtraFieldsInput } from "../controls";

export const EditClientDefaultOther = ({client, onChange}) => (
  <>
    <Row>
      <h1>{t('config.company.other')}</h1>
      <Col sm={4}>
        <StringInput
          label={t('invoice.fileName')}
          placeholder={t('invoice.fileNamePlaceHolder')}
          value={client.invoiceFileName}
          onChange={value => onChange({...client, invoiceFileName: value})}
          data-tst="client.invoiceFileName"
        />
      </Col>

      <Col sm={4}>
        <PropertiesSelect
          label={t('client.extraFields')}
          values={client.extraFields}
          onChange={value => onChange({...client, extraFields: value})}
          data-tst="client.extraFields"
        />
      </Col>
    </Row>
    <Row>
      <ExtraFieldsInput
        properties={client.extraFields}
        onChange={value => onChange({...client, extraFields: value})}
        data-tst="client.extraFields"
      />
    </Row>
  </>
);
