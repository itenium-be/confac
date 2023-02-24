import {EmailModel} from './EmailModels';

export function getNewEmail(defaultValues?: Partial<EmailModel>): EmailModel {
  return {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: [],
    ...defaultValues,
  };
}
