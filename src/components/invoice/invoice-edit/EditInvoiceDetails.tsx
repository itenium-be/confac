import React from 'react';
import {Col} from 'react-bootstrap';
import {t} from '../../utils';
import * as Control from '../../controls';

export const EditInvoiceDetails = ({invoice, onChange}) => {
  const tp = (transKey: string): string => t(invoice.getType() + transKey);
  return (
    <>
      <Col sm={6}>
        <Control.NumericInput
          prefix={invoice.verified ? <Control.VerifyIcon style={{fontSize: 16}} title={t('invoice.isVerified')} data-tst="invoice-is-verified" /> : undefined}
          label={tp('.number')}
          value={invoice.number}
          onChange={value => onChange('number', value)}
          data-tst="invoice.number"
        />
      </Col>
      <Col sm={6}>
        <Control.DatePicker
          label={tp('.date')}
          value={invoice.date}
          onChange={value => onChange('date', value)}
          data-tst="invoice.date"
        />
      </Col>

      <Col sm={6}>
        <Control.StringInput
          label={t('invoice.orderNr')}
          value={invoice.orderNr}
          onChange={value => onChange('orderNr', value)}
          data-tst="invoice.orderNr"
        />
      </Col>
      <Col sm={6}>
        <Control.StringInput
          label={tp('.fileName')}
          value={invoice.fileName}
          onChange={value => onChange('fileName', value)}
          data-tst="invoice.fileName"
        />
      </Col>
    </>
  );
};
