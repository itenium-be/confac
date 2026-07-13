import moment from 'moment';
import {t} from '../../utils';
import {InvoiceBillitError} from '../models/InvoiceModel';


const BillitErrorEntry = ({error}: {error: InvoiceBillitError}) => (
  <div style={{marginLeft: 10, marginTop: 4, padding: 8, backgroundColor: '#f8d7da', borderRadius: 4}}>
    <div style={{fontSize: '0.9em', color: '#666'}}>
      {moment(error.date).format('DD/MM/YYYY HH:mm')} - {error.operation}
    </div>
    {error.billitErrors?.length ? (
      <ul style={{marginBottom: 0, paddingLeft: 20}}>
        {error.billitErrors.map((billitError, idx) => (
          <li key={idx}>
            <strong>{billitError.Code}</strong>
            {billitError.Description && <>: {billitError.Description}</>}
          </li>
        ))}
      </ul>
    ) : (
      <div>{error.message}</div>
    )}
  </div>
);


type BillitErrorsProps = {
  errors: InvoiceBillitError[] | undefined;
  title?: string;
}

export const BillitErrors = ({errors, title}: BillitErrorsProps) => {
  if (!errors?.length) {
    return null;
  }

  return (
    <div style={{marginBottom: 8}} data-testid="peppol-errors">
      <strong style={{color: '#dc3545'}}>{title || t('invoice.peppolErrors')}:</strong>
      {errors.map((error, idx) => <BillitErrorEntry key={idx} error={error} />)}
    </div>
  );
};
