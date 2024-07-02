import React, {useState} from 'react';
import {Form, Row} from 'react-bootstrap';
import {EditorState} from 'draft-js';
import {StringInput} from '../form-controls/inputs/StringInput';
import {t} from '../../utils';
import {EmailModel} from './EmailModels';
import {BaseInputProps} from '../form-controls/inputs/BaseInput';
import {getNewEmail} from './getNewEmail';
import {Button} from '../form-controls/Button';
import {TextEditor} from '../form-controls/inputs/TextEditor';
import {ITextEditorCustomReplacement} from '../../invoice/invoice-replacements';
import {TextEditorReplacements} from '../form-controls/inputs/TextEditorReplacements';

import './EmailForm.scss';


type EmailFormProps = BaseInputProps<EmailModel> & {
  /** Attachments that are available for emailing */
  attachmentsAvailable: string[],
  textEditorReplacements?: ITextEditorCustomReplacement[]
};

export const EmailForm = ({value, onChange, attachmentsAvailable, textEditorReplacements}: EmailFormProps) => {
  const [showAllTos, setShowAllTos] = useState(false);

  // eslint-disable-next-line no-param-reassign
  value = value || getNewEmail();

  let getToolbarCustomButtons: (editorState: EditorState) => JSX.Element[] = () => [];
  if (textEditorReplacements && textEditorReplacements.length) {
    getToolbarCustomButtons = (editorState: EditorState) => (
      [<TextEditorReplacements editorState={editorState} replacements={textEditorReplacements}/>]
    );
  }

  return (
    <Form className="email-form">
      <StringInput
        inline
        value={value.to}
        onChange={to => onChange({...value, to} as EmailModel)}
        label={t('email.to')}
        placeholder={t('email.toPlaceholder')}
        suffix={(
          <Button variant="outline-secondary" className="tst-toggle-email-to" onClick={() => setShowAllTos(!showAllTos)} icon="fa fa-ellipsis-v" />
        )}
        suffixOptions={{type: 'button'}}
      />


      {showAllTos && (
        <>
          <StringInput inline value={value.cc} onChange={cc => onChange({...value, cc} as EmailModel)} label={t('email.cc')} />
          <StringInput inline value={value.bcc} onChange={bcc => onChange({...value, bcc} as EmailModel)} label={t('email.bcc')} />
        </>
      )}
      <StringInput
        inline
        value={value.subject}
        onChange={subject => onChange({...value, subject} as EmailModel)}
        label={t('email.subject')}
      />

      <TextEditor
        value={value.body}
        onChange={body => onChange({...value, body} as EmailModel)}
        getToolbarCustomButtons={getToolbarCustomButtons}
      />

      <h4 style={{marginTop: 20}}>
        {t('email.attachments')}
        {attachmentsAvailable.length === 1 && <div style={{fontSize: 14}}>{t('attachment.noneUploaded')}</div>}
      </h4>
      <EmailFormAttachments expectedAttachments={value.attachments} attachmentsAvailable={attachmentsAvailable} />

    </Form>
  );
};

type EmailFormAttachmentsProps = {
  expectedAttachments: string[],
  attachmentsAvailable: string[],
}



const EmailFormAttachments = ({expectedAttachments, attachmentsAvailable}: EmailFormAttachmentsProps) => (
  <Row className="email-attachments">
    {expectedAttachments.map(attachment => {
      const isAvailable = attachmentsAvailable.some(a => a === attachment);
      return (
        <div key={attachment} className={isAvailable ? 'success tst-attachment-available' : 'danger tst-attachment-unavailable'}>
          <i className={isAvailable ? 'fa fa-check-circle' : 'fa fa-exclamation-circle'} />
          <span>{attachment}</span>
        </div>
      );
    })}
  </Row>
);
