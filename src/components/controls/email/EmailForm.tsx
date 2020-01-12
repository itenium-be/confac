import React, {useState} from 'react';
import {Form, Button, Row} from 'react-bootstrap';
import {Icon} from '../../controls';
import {StringInput} from '../form-controls/inputs/StringInput';
import {t} from '../../utils';
import {TextEditor} from '../form-controls/inputs/TextEditor';
import {EmailModel} from './EmailModels';
import {BaseInputProps} from '../form-controls/inputs/BaseInput';
import {getNewEmail} from './getNewEmail';

import './EmailForm.scss';


type EmailFormProps = BaseInputProps<EmailModel> & {
  /**
   * Attachments that are available for emailing
   */
  attachmentsAvailable: string[],
};

export const EmailForm = ({value, onChange, attachmentsAvailable, ...props}: EmailFormProps) => {
  const [showAllTos, setShowAllTos] = useState(false);

  value = value || getNewEmail();

  return (
    <Form>
      <StringInput
        inline
        value={value.to}
        onChange={(to) => onChange({...value, to} as EmailModel)}
        label={t('email.to')}
        placeholder={t('email.toPlaceholder')}
        suffix={(
          <Button variant="outline-secondary" onClick={() => setShowAllTos(!showAllTos)}>
            <Icon fa="fa fa-ellipsis-v" size={1} />
          </Button>
        )}
        suffixOptions={{type: 'button'}}
      />


      {showAllTos && (
        <>
          <StringInput inline value={value.cc} onChange={(cc) => onChange({...value, cc} as EmailModel)} label={t('email.cc')} />
          <StringInput inline value={value.bcc} onChange={(bcc) => onChange({...value, bcc} as EmailModel)} label={t('email.bcc')} />
        </>
      )}
      <StringInput inline value={value.subject} onChange={(subject) => onChange({...value, subject} as EmailModel)} label={t('email.subject')} />


      <TextEditor value={value.body} onChange={(body) => onChange({...value, body} as EmailModel)} />

      <h4 style={{marginTop: 20}}>{t('email.attachments')}</h4>
      <EmailFormAttachments expectedAttachments={value.attachments} attachmentsAvailable={attachmentsAvailable} />

    </Form>
  );
};

type EmailFormAttachments = {
  expectedAttachments: string[],
  attachmentsAvailable: string[],
}



const EmailFormAttachments = ({expectedAttachments, attachmentsAvailable}: EmailFormAttachments) => (
  <Row className="email-attachments">
    {expectedAttachments.map((attachment) => {
      const isAvailable = attachmentsAvailable.some((a) => a === attachment);
      return (
        <div key={attachment} className={isAvailable ? 'success' : 'danger'}>
          <i className={isAvailable ? 'fa fa-check-circle' : 'fa fa-exclamation-circle'} />
          <span>{attachment}</span>
        </div>
      );
    })}
  </Row>
);
