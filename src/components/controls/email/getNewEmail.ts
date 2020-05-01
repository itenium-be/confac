import {EmailModel} from './EmailModels';

export function getNewEmail(defaultValues?: EmailModel): EmailModel {
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
