import {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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
import { ClientModel } from '../../client/models/ClientModels';


export enum EmailTemplate {
  None,
  InitialEmail,
  Reminder,
}


const getDefaultEmailValue = (
  invoice: InvoiceModel,
  client: ClientModel | undefined,
  template: EmailTemplate,
  config: ConfigModel,
): EmailModel => {

  const defaultEmail = config.email;
  if (!client?.email) {
    return {to: '', ...defaultEmail};
  }

  const emailValues = Object.keys(client.email).reduce((acc: EmailModel, cur: string) => {
    if (client.email[cur]) {
      acc[cur] = client.email[cur];
      return acc;
    }
    return acc;
  }, {} as EmailModel);

  if (!emailValues.attachments.length) {
    emailValues.attachments = defaultEmail.attachments;
  }

  const finalValues = {...defaultEmail, ...emailValues};
  finalValues.subject = invoiceReplacements(finalValues.subject, invoice);
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
  }
  finalValues.body = invoiceReplacements(finalValues.body, invoice);
  finalValues.body += config.emailSignature;

  return getNewEmail(finalValues);
};




type EmailModalProps = Omit<BaseModalProps, 'show'> & {
  invoice: InvoiceModel;
  template: EmailTemplate;
}


export const EmailModal = ({invoice, onClose, template, ...props}: EmailModalProps) => {
  const dispatch = useDispatch();
  const config = useSelector((state: ConfacState) => state.config);
  const client = useSelector((state: ConfacState) => state.clients.find(x => x._id === invoice.client._id));
  const [value, setValue] = useState(getDefaultEmailValue(invoice, client, template, config));

  const attachmentsAvailable = invoice.attachments.map(a => a.type);
  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={() => dispatch(sendEmail(client?.invoiceFileName || config.invoiceFileName, invoice, value, config.emailInvoiceOnly) as any)}
      confirmText={t('email.send')}
      confirmVariant="danger"
      title={<EmailModalTitle title={t('email.title')} lastEmail={invoice.lastEmail} />}
      {...props}
    >
      <EmailForm
        value={value}
        onChange={setValue}
        attachmentsAvailable={attachmentsAvailable}
        textEditorReplacements={getInvoiceReplacements(invoice)}
      />
    </Modal>
  );
};





type EmailModalTitleProps = {
  title: string,
  lastEmail: string,
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
