import React, { useState } from 'react';
import { Modal, BaseModalProps } from '../Modal';
import { t } from '../../util';
import { EmailForm } from './EmailForm';
import { createEmptyModel, EmailModel } from './EmailModels';

type EmailModalProps = BaseModalProps & {
  title: string,
  onConfirm: (email: EmailModel) => void,
  defaultValue: EmailModel,
}

export const EmailModal = ({defaultValue, show, onClose, onConfirm, ...props}: EmailModalProps) => {
  const [value, setValue] = useState(createEmptyModel(defaultValue));

  return (
    <Modal
      show={show}
      onClose={onClose}
      onConfirm={() => onConfirm(value)}
      confirmText={t('email.send')}
      confirmVariant="danger"
      {...props}
    >
      <EmailForm value={value} onChange={setValue} />
    </Modal>
  );
}
