import {Col} from 'react-bootstrap';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {NumericInput} from '../../controls/form-controls/inputs/NumericInput';
import {InvoiceStatusIcon} from '../../controls/icons/InvoiceStatusIcon';
import {StringInput} from '../../controls/form-controls/inputs/StringInput';
import {DatePicker} from '../../controls/form-controls/DatePicker';

type EditInvoiceDetailsProps = {
  invoice: InvoiceModel;
  onChange: (fieldName: string, value: any) => void;
}

export const EditInvoiceDetails = ({invoice, onChange}: EditInvoiceDetailsProps) => {
  const tp = (transKey: string): string => t(invoice.getType() + transKey);
  return (
    <>
      <Col sm={5}>
        <NumericInput
          prefix={!invoice.isNew && <InvoiceStatusIcon invoice={invoice} style={{fontSize: 16}} />}
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
        <StringInput
          label={t('invoice.discount')}
          placeholder={t('invoice.discountPlaceholder')}
          value={invoice.discount}
          onChange={value => onChange('discount', value)}
        />
      </Col>
    </>
  );
};
