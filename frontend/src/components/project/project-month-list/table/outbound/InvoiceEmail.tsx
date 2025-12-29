import {useState} from 'react';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {Button} from '../../../../controls/form-controls/Button';
import {NotEmailedIcon, EmailedIcon, NotPeppoledIcon, PeppoledIcon} from '../../../../controls/Icon';
import {t} from '../../../../utils';
import InvoiceModel from '../../../../invoice/models/InvoiceModel';
import {EmailModal, EmailTemplate} from '../../../../controls/email/EmailModal';
import {Claim} from '../../../../users/models/UserModel';
import {ClaimGuard, ClaimGuardSwitch} from '../../../../enhancers/EnhanceWithClaim';
import {ConfacState} from '../../../../../reducers/app-state';

type InvoiceEmailProps = {
  invoice: InvoiceModel;
};

export const InvoiceEmail = ({invoice}: InvoiceEmailProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const peppolPivotDate = useSelector((state: ConfacState) => state.config.peppolPivotDate);
  const usePeppol = moment(invoice.audit?.createdOn).isSameOrAfter(peppolPivotDate, 'day');

  const emailIcon = !invoice.lastEmail ? (
    usePeppol ? <NotPeppoledIcon style={{fontSize: 17}} /> : <NotEmailedIcon style={{fontSize: 17}} />
  ) : (
    usePeppol
      ? <PeppoledIcon title={t('email.lastEmailDaysAgo', {daysAgo: moment(invoice.lastEmail).fromNow()})} style={{fontSize: 17}} />
      : <EmailedIcon title={t('email.lastEmailDaysAgo', {daysAgo: moment(invoice.lastEmail).fromNow()})} style={{fontSize: 17}} />
  );

  return (
    <ClaimGuardSwitch>
      <ClaimGuard claim={Claim.EmailInvoices}>
        <Button className="tst-open-email" onClick={() => setShowModal(true)} variant="link">
          {emailIcon}
        </Button>
        {showModal && (
          <EmailModal
            template={invoice.lastEmail ? EmailTemplate.Reminder : EmailTemplate.InitialEmail}
            invoice={invoice}
            onClose={() => setShowModal(false)}
          />
        )}
      </ClaimGuard>
      <ClaimGuard claim={Claim.ViewEmailInvoices}>
        {emailIcon}
      </ClaimGuard>
    </ClaimGuardSwitch>
  );
};
