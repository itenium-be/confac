export type EmailModel = {
  from?: string,
  to: string,
  cc?: string,
  bcc?: string,
  subject: string,
  body: string,
  /**
   * Expected email attachments
   */
  attachments: string[],
}
