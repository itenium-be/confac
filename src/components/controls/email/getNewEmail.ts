import { EmailModel } from "./EmailModels";

export function getNewEmail(defaultValues?: EmailModel): EmailModel {
  return Object.assign({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: [],
  }, defaultValues);
}
