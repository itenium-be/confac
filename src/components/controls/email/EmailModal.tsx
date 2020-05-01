import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {Modal, BaseModalProps} from '../Modal';
import {t} from '../../utils';
import {EmailForm} from './EmailForm';
import {EmailModel} from './EmailModels';
import {getNewEmail} from './getNewEmail';
import InvoiceModel from '../../invoice/models/InvoiceModel';
import {invoiceReplacements} from '../../invoice/invoice-replacements';
import {ConfacState} from '../../../reducers/app-state';
import {sendEmail} from '../../../actions/emailActions';
import {ConfigModel} from '../../config/models/ConfigModel';
import {projectMonthResolve} from '../../project/ProjectMonthsLists';
import {FullProjectMonthModel} from '../../project/models/FullProjectMonthModel';



const getDefaultEmailValue = (i: InvoiceModel, config: ConfigModel, fullProjectMonth?: FullProjectMonthModel): EmailModel => {
  const defaultEmail = config.email;
  if (!i.client || !i.client.email) {
    return defaultEmail;
  }

  const emailValues = Object.keys(i.client.email).reduce((acc: EmailModel, cur: string) => {
    if (i.client.email[cur]) {
      acc[cur] = i.client.email[cur];
      return acc;
    }
    return acc;
  }, {} as EmailModel);

  const finalValues = {...defaultEmail, ...emailValues};
  finalValues.subject = invoiceReplacements(finalValues.subject, i, fullProjectMonth);
  if (i.lastEmail && config.emailReminder) {
    finalValues.body = config.emailReminder;
  }
  finalValues.body = invoiceReplacements(finalValues.body, i, fullProjectMonth);
  finalValues.body += config.emailSignature;

  return getNewEmail(finalValues);
};




type EmailModalProps = Omit<BaseModalProps, 'show'> & {
  invoice: InvoiceModel;
}


export const EmailModal = ({invoice, onClose, ...props}: EmailModalProps) => {
  const dispatch = useDispatch();
  const config = useSelector((state: ConfacState) => state.config);
  const fullProjectMonths = useSelector((state: ConfacState) => state.projectsMonth.map(pm => projectMonthResolve(pm, state)));
  const fullProjectMonth = fullProjectMonths.find(x => x.invoice && x.invoice._id === invoice._id);
  const [value, setValue] = useState(getDefaultEmailValue(invoice, config, fullProjectMonth));

  const attachmentsAvailable = invoice.attachments.map(a => a.type);
  return (
    <Modal
      show
      onClose={onClose}
      onConfirm={() => dispatch(sendEmail(invoice, value, fullProjectMonth))}
      confirmText={t('email.send')}
      confirmVariant="danger"
      title={<EmailModalTitle title={t('email.title')} lastEmail={invoice.lastEmail} />}
      {...props}
    >
      <EmailForm value={value} onChange={setValue} attachmentsAvailable={attachmentsAvailable} />
    </Modal>
  );
};





type EmailModalTitleProps = {
  title: string,
  lastEmail: string,
}

export const EmailModalTitle = ({title, lastEmail}: EmailModalTitleProps) => {
  if (!lastEmail) {
    return <span>{title}</span>;
  }

  return (
    <span>
      {title}
      <small className="modal-subtitle">
        {t('email.lastEmail', {at: moment(lastEmail).format('D/M/YYYY'), daysAgo: moment(lastEmail).fromNow()})}
      </small>
    </span>
  );
};
