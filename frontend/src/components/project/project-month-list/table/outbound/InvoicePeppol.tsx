import {useState} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from '../../../../controls/form-controls/Button';
import {NotPeppoledIcon, PeppoledIcon} from '../../../../controls/Icon';
import {t} from '../../../../utils';
import InvoiceModel from '../../../../invoice/models/InvoiceModel';
import {Claim} from '../../../../users/models/UserModel';
import {ClaimGuard, ClaimGuardSwitch} from '../../../../enhancers/EnhanceWithClaim';
import {ConfacState} from '../../../../../reducers/app-state';
import {PeppolModal} from '../../../../invoice/controls/PeppolModal';
import {sendToPeppol} from '../../../../../actions';
import {getInvoiceFileName} from '../../../../../actions/utils/download-helpers';

type InvoicePeppolProps = {
  invoice: InvoiceModel;
};

export const InvoicePeppol = ({invoice}: InvoicePeppolProps) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const clients = useSelector((state: ConfacState) => state.clients);
  const config = useSelector((state: ConfacState) => state.config);

  const isSent = invoice.status === 'ToPay' || invoice.status === 'Paid';

  const peppolIcon = isSent ? (
    <PeppoledIcon
      title={t('email.lastPeppolDaysAgo', {daysAgo: moment(invoice.lastEmail).fromNow()})}
      style={{fontSize: 17}}
    />
  ) : (
    <NotPeppoledIcon
      title={t('invoice.peppolNotSent')}
      style={{fontSize: 17}}
    />
  );

  const client = clients.find(c => c._id === invoice.client._id);

  return (
    <ClaimGuardSwitch>
      <ClaimGuard claim={Claim.EmailInvoices}>
        <Button className="tst-open-peppol" onClick={() => setShowModal(true)} variant="link">
          {peppolIcon}
        </Button>
        {showModal && (
          <PeppolModal
            invoice={invoice}
            client={client}
            onClose={() => setShowModal(false)}
            onConfirm={() => {
              const fileNameTemplate = invoice.client.invoiceFileName || config.invoiceFileName;
              const pdfFileName = getInvoiceFileName(fileNameTemplate, invoice, 'pdf');
              dispatch(sendToPeppol(invoice._id, pdfFileName) as any);
              setShowModal(false);
            }}
          />
        )}
      </ClaimGuard>
      <ClaimGuard claim={Claim.ViewEmailInvoices}>
        {peppolIcon}
      </ClaimGuard>
    </ClaimGuardSwitch>
  );
};
