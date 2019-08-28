import { Row, Col } from "react-bootstrap";
import React from "react";
import { t } from "../util";
import * as Control from "../controls";

export const EditConfigUserSettings = ({config, onChange}) => (
  <Row>
    <h1>{t('config.settingsTitle')}</h1>
    <Col sm={4}>
      <Control.Switch
        label={t('config.showOrderNr')}
        checked={config.showOrderNr}
        onChange={(checked: boolean) => onChange({showOrderNr: checked})}
        data-tst="config.showOrderNr"
      />
    </Col>

    <Col sm={4}>
      <Control.Switch
        label={t('config.groupByMonth')}
        checked={config.groupInvoiceListByMonth}
        onChange={(checked: boolean) => onChange({groupInvoiceListByMonth: checked})}
        data-tst="config.groupByMonth"
      />
    </Col>
  </Row>
);
