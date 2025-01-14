import { useState } from 'react';
import moment from 'moment';
import { Button } from '../../../../controls/form-controls/Button';
import { NotEmailedIcon, EmailedIcon } from '../../../../controls/Icon';
import { t } from '../../../../utils';
import InvoiceModel from '../../../../invoice/models/InvoiceModel';
import { EmailModal, EmailTemplate } from '../../../../controls/email/EmailModal';
import { Claim } from '../../../../users/models/UserModel';
import { ClaimGuard } from '../../../../enhancers/EnhanceWithClaim';

type InvoiceEmailProps = {
  invoice: InvoiceModel;
};

export const InvoiceEmail = ({ invoice }: InvoiceEmailProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <ClaimGuard claim={Claim.EmailInvoices}>
      <Button className="tst-open-email" onClick={() => setShowModal(true)} variant="link">
        {!invoice.lastEmail ? (
          <NotEmailedIcon style={{ fontSize: 17 }} />
        ) : (
          <EmailedIcon title={t('email.lastEmailDaysAgo', { daysAgo: moment(invoice.lastEmail).fromNow() })} style={{ fontSize: 17 }} />
        )}
      </Button>
      {showModal && (
        <EmailModal
          template={invoice.lastEmail ? EmailTemplate.Reminder : EmailTemplate.InitialEmail}
          invoice={invoice}
          onClose={() => setShowModal(false)} />
      )}
    </ClaimGuard>
  );
};
