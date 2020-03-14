import React from 'react';
import {Col} from 'react-bootstrap';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {NumericInput} from '../../controls/form-controls/inputs/NumericInput';
import {VerifyIcon} from '../../controls/Icon';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {DatePicker} from '../../controls/form-controls/DatePicker';

type EditInvoiceDetailsProps = {
  invoice: InvoiceModel;
  onChange: Function;
}

export const EditInvoiceDetails = ({invoice, onChange}: EditInvoiceDetailsProps) => {
  const tp = (transKey: string): string => t(invoice.getType() + transKey);
  return (
    <>
      <Col sm={5}>
        <NumericInput
          prefix={invoice.verified && <VerifyIcon style={{fontSize: 16}} title={t('invoice.isVerified')} data-tst="is-verified" />}
          label={tp('.number')}
          value={invoice.number}
          onChange={value => onChange('number', value)}
          data-tst="invoice.number"
        />
      </Col>
      <Col sm={7}>
        <DatePicker
          label={tp('.date')}
          value={invoice.date}
          onChange={value => onChange('date', value)}
          data-tst="invoice.date"
        />
      </Col>

      <Col sm={5}>
        <StringInput
          label={t('invoice.orderNr')}
          value={invoice.orderNr}
          onChange={value => onChange('orderNr', value)}
          data-tst="invoice.orderNr"
        />
      </Col>
      <Col sm={7} />
    </>
  );
};
