import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Icon } from "../../controls";
import { StringInput } from "../form-controls/inputs/StringInput";
import { t } from "../../util";
import { TextEditor } from "../form-controls/inputs/TextEditor";
import { EmailModel, createEmptyModel } from "./EmailModels";
import { BaseInputProps } from "../form-controls/inputs/BaseInput";


type EmailFormProps = BaseInputProps<EmailModel>;

export const EmailForm = ({value, onChange, ...props}: EmailFormProps) => {
  const [showAllTos, setShowAllTos] = useState(false);

  value = value || createEmptyModel();

  return (
    <Form>
      <StringInput
        inline
        value={value.to}
        onChange={to => onChange({...value, to} as EmailModel)}
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
          <StringInput inline value={value.cc} onChange={cc => onChange({...value, cc} as EmailModel)} label={t('email.cc')} />
          <StringInput inline value={value.bcc} onChange={bcc => onChange({...value, bcc} as EmailModel)} label={t('email.bcc')} />
        </>
      )}
      <StringInput inline value={value.subject} onChange={subject => onChange({...value, subject} as EmailModel)} label={t('email.subject')} />


      <TextEditor value={value.body} onChange={body => onChange({...value, body} as EmailModel)} />

      <b>Bijlagen</b>
    </Form>
  )
}
