// Exercises 9:
// For the insane
// There is so much going on here, where to even start

describe.skip('emailInvoiceController', () => {
  it('returns 500 when invoice attachments could not be found', () => {})
  it('updates the invoice.lastEmail sent date to now', () => {})

  describe('merging pdfs into a single attachment', () => {
    it('returns 400 when one of the attachments to be merged is not a pdf', () => {})
    it('merges the config TermsAndConditions pdf last if there is one', () => {})
  })

  describe('email sending with @sendgrid/mail', () => {
    it('sets the correct from address', () => {})
    it('sends to the correct to/cc/bcc addresses', () => {})
    it('contains the expected attachment(s)', () => {})
  })

  describe('if a emailInvoiceOnly is passed, send additional email', () => {
    it('email with the invoice PDF only', () => {})
    it('should not let the frontend decide this, rather fetch from the db', () => {})
  })
})
