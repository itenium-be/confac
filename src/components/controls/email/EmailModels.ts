import { getNewEmail } from "../../../reducers/default-states";

export type EmailModel = {
  to: string,
  cc?: string,
  bcc?: string,
  subject: string,
  body: string,
}

export function createEmptyModel(defaults?: EmailModel): EmailModel {
  return Object.assign(getNewEmail(), defaults);
}
