import React from 'react';
import {Col} from 'react-bootstrap';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {NumericInput} from '../../controls/form-controls/inputs/NumericInput';
import {VerifyIcon} from '../../controls/icons/VerifyIcon';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {DatePicker} from '../../controls/form-controls/DatePicker';
import {ProjectMonthSelect} from '../../project/controls/ProjectMonthSelect';

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
          prefix={invoice.verified && <VerifyIcon style={{fontSize: 16}} title={t('invoice.isVerified')} />}
          label={tp('.number')}
          value={invoice.number}
          onChange={value => onChange('number', value)}
        />
      </Col>
      <Col sm={7}>
        <DatePicker
          label={tp('.date')}
          value={invoice.date}
          onChange={value => onChange('date', value)}
        />
      </Col>

      <Col sm={5}>
        <StringInput
          label={t('invoice.orderNr')}
          value={invoice.orderNr}
          onChange={value => onChange('orderNr', value)}
        />
      </Col>
      <Col sm={7}>
        <ProjectMonthSelect
          label={t('projectMonth.selectLabel')}
          value={invoice.projectMonthId ? invoice.projectMonthId : ''}
          onChange={fullProjectMonth => {
            onChange('projectMonthId', fullProjectMonth._id);
            onChange('consultantId', fullProjectMonth.consultant._id);
          }}
        />
      </Col>
    </>
  );
};
