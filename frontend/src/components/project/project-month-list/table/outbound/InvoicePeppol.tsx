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
import {SendToPeppolModal, PeppolStatusModal} from '../../../../invoice/controls/PeppolModal';
import {sendToPeppol, refreshPeppolStatus, syncClientPeppolStatus} from '../../../../../actions';
import {getInvoiceFileName} from '../../../../../actions/utils/download-helpers';

type InvoicePeppolProps = {
  invoice: InvoiceModel;
};

export const InvoicePeppol = ({invoice}: InvoicePeppolProps) => {
  const dispatch = useDispatch();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
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
        <Button
          className="tst-open-peppol"
          onClick={() => {
            if (isSent) {
              setShowStatusModal(true);
            } else {
              dispatch(syncClientPeppolStatus(invoice.client._id) as any);
              setShowSendModal(true);
            }
          }}
          variant="link"
        >
          {peppolIcon}
        </Button>
        {showSendModal && (
          <SendToPeppolModal
            invoice={invoice}
            client={client}
            onClose={() => setShowSendModal(false)}
            onConfirm={() => {
              const fileNameTemplate = invoice.client.invoiceFileName || config.invoiceFileName;
              const pdfFileName = getInvoiceFileName(fileNameTemplate, invoice, 'pdf');
              dispatch(sendToPeppol(invoice._id, pdfFileName) as any);
              setShowSendModal(false);
            }}
          />
        )}
        {showStatusModal && (
          <PeppolStatusModal
            invoice={invoice}
            onClose={() => setShowStatusModal(false)}
            onRefresh={() => {
              dispatch(refreshPeppolStatus(invoice._id) as any);
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
