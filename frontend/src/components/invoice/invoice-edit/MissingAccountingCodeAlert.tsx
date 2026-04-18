import {Alert} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {t} from '../../utils';
import InvoiceModel from '../models/InvoiceModel';
import {ConfacState} from '../../../reducers/app-state';
import {ConsultantLink} from '../../consultant/controls/ConsultantLink';


type Props = {
  invoice: InvoiceModel;
}

const MissingAccountingCodeAlert = ({invoice}: Props) => {
  const consultantId = invoice.projectMonth?.consultantId;
  const consultant = useSelector((state: ConfacState) => state.consultants.find(c => c._id === consultantId));

  if (invoice.isQuotation || !consultantId || !consultant || consultant.accountingCode) {
    return null;
  }

  return (
    <Alert variant="warning">
      <i className="fa fa-exclamation-triangle" style={{marginRight: 8}} />
      {t('invoice.missingAccountingCode')}
      {' '}
      <ConsultantLink consultant={consultant} />
    </Alert>
  );
};

export default MissingAccountingCodeAlert;
