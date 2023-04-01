// Exercises 8:
// Only for true Jest mock aficionados

describe.skip('createInvoiceController', () => {
  it('validates that the invoice nr does not yet exist', () => {})
  it('validates that no invoice with a later invoice date exists', () => {})

  describe('invoice pdf creation', () => {
    it('checks the pug template exists', () => {})
    it('saves the attachment in the db', () => {})
    it('returns 500 with err.message when pdf creation fails', () => {})

    // TODO: Any further pug testing (variables, functions, ...) should
    // TODO: probably move to its own test suite
  })

  describe('when created from a projectMonth', () => {
    it('moves the attachments from the projectMonth to the invoice', () => {})
    it('links the invoice and projectMonth with eachother', () => {})
  })

  describe('Not an Invoice but a Quotation when invoice.isQuotation is true', () => {
    it('has less validation', () => {})
    it('uses another pug template', () => {})
  })
})
