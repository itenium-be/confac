import React, {useState} from 'react';
import moment from 'moment';
import {Modal, BaseModalProps} from '../Modal';
import {t} from '../../utils';
import {EmailForm} from './EmailForm';
import {EmailModel} from './EmailModels';
import {getNewEmail} from './getNewEmail';

type EmailModalProps = BaseModalProps & {
  title: string | React.ReactNode,
  onConfirm: (email: EmailModel) => void,
  defaultValue: EmailModel,
  attachmentsAvailable: string[],
}

export const EmailModal = ({defaultValue, show, onClose, onConfirm, attachmentsAvailable, ...props}: EmailModalProps) => {
  const [value, setValue] = useState(getNewEmail(defaultValue));

  return (
    <Modal
      show={show}
      onClose={onClose}
      onConfirm={() => onConfirm(value)}
      confirmText={t('email.send')}
      confirmVariant="danger"
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
      <small className="modal-subtitle">{t('email.lastEmail', {at: moment(lastEmail).format('D/M/YYYY')})}</small>
    </span>
  );
};
