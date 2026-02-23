import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {AppDispatch} from '../../../types/redux';
import moment from 'moment';
import {Modal, BaseModalProps} from '../Modal';
import {t} from '../../utils';
import {EmailForm} from './EmailForm';
import {EmailModel} from './EmailModels';
import {getNewEmail} from './getNewEmail';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {invoiceReplacements, getInvoiceReplacements} from '../../invoice/invoice-replacements';
import {ConfacState} from '../../../reducers/app-state';
import {sendEmail} from '../../../actions/emailActions';
import {ConfigModel} from '../../config/models/ConfigModel';
import {ClientModel} from '../../client/models/ClientModels';


export enum EmailTemplate {
  None,
  InitialEmail,
  Reminder,
  PeppolDuplicate,
}


const getDefaultEmailValue = (
  invoice: InvoiceModel,
  client: ClientModel | undefined,
  template: EmailTemplate,
  config: ConfigModel,
  creditNotes: InvoiceModel[],
): EmailModel => {

  const defaultEmail = config.email;
  if (!client?.email) {
    return {to: '', ...defaultEmail};
  }

  const clientEmail = client.email as Record<string, unknown>;
  const emailValues = Object.keys(clientEmail).reduce((acc: Record<string, unknown>, cur: string) => {
    if (clientEmail[cur]) {
      acc[cur] = clientEmail[cur];
      return acc;
    }
    return acc;
  }, {} as Record<string, unknown>) as EmailModel;

  if (!emailValues.attachments.length) {
    emailValues.attachments = defaultEmail.attachments;
  }

  const finalValues = {...defaultEmail, ...emailValues};
  finalValues.subject = invoiceReplacements(finalValues.subject, invoice, creditNotes);
  if (template === EmailTemplate.Reminder) {
    if (config.emailReminder) {
      finalValues.body = config.emailReminder;
    }
    if (config.emailReminderCc && !client.email.cc) {
      finalValues.cc = config.emailReminderCc;
    }
    if (config.emailReminderBcc && !client.email.bcc) {
      finalValues.bcc = config.emailReminderBcc;
    }
  } else if (template === EmailTemplate.PeppolDuplicate) {
    if (config.emailPeppolDuplicateSubject) {
      finalValues.subject = invoiceReplacements(config.emailPeppolDuplicateSubject, invoice, creditNotes);
    }
    if (config.emailPeppolDuplicateBody) {
      finalValues.body = config.emailPeppolDuplicateBody;
    }
  } else if (invoice.money.total < 0 && config.emailCreditNotaSubject) {
    finalValues.subject = invoiceReplacements(config.emailCreditNotaSubject, invoice, creditNotes);
    finalValues.body = config.emailCreditNotaBody;
  }
  finalValues.body = invoiceReplacements(finalValues.body, invoice, creditNotes);
  finalValues.body += config.emailSignature;

  return getNewEmail(finalValues);
};




type EmailModalProps = Omit<BaseModalProps, 'show'> & {
  invoice: InvoiceModel;
  template: EmailTemplate;
}


export const EmailModal = ({invoice, onClose, template, ...props}: EmailModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector((state: ConfacState) => state.config);
  const client = useSelector((state: ConfacState) => state.clients.find(x => x._id === invoice.client._id));
  const creditNotes = useSelector((state: ConfacState) => {
    if (invoice.creditNotas?.length) {
      return state.invoices.filter(x => invoice.creditNotas.includes(x._id));
    }
    return [];
  });
  const [value, setValue] = useState(getDefaultEmailValue(invoice, client, template, config, creditNotes));

  const attachmentsAvailable = invoice.attachments.map(a => a.type);
  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={() => void dispatch(sendEmail(client?.invoiceFileName || config.invoiceFileName, invoice, value, config.emailInvoiceOnly))}
      confirmText={t('email.send')}
      confirmVariant="danger"
      title={<EmailModalTitle title={t('email.title')} lastEmail={invoice.lastEmail} />}
      {...props}
    >
      <EmailForm
        value={value}
        onChange={setValue}
        attachmentsAvailable={attachmentsAvailable}
        textEditorReplacements={getInvoiceReplacements(invoice, creditNotes)}
      />
    </Modal>
  );
};





type EmailModalTitleProps = {
  title: string;
  lastEmail: string;
}

export const EmailModalTitle = ({title, lastEmail}: EmailModalTitleProps) => {
  return (
    <span>
      {title}
      <small className="modal-subtitle">
        {lastEmail && t('email.lastEmail', {at: moment(lastEmail).format('D/M/YYYY'), daysAgo: moment(lastEmail).fromNow()})}
        {!lastEmail && t('email.notMailed')}
      </small>
    </span>
  );
};
