module.exports = {
  async up(db) {
    // Convert verified: true to status: 'Paid'
    const paidResult = await db.collection('invoices').updateMany(
      { verified: true },
      {
        $set: { status: 'Paid' },
        $unset: { verified: '' }
      }
    );
    console.log(`Updated ${paidResult.modifiedCount} invoices from verified: true to status: 'Paid'`);

    // Convert verified: false to status: 'ToPay'
    const toPayResult = await db.collection('invoices').updateMany(
      { verified: false },
      {
        $set: { status: 'ToPay' },
        $unset: { verified: '' }
      }
    );
    console.log(`Updated ${toPayResult.modifiedCount} invoices from verified: false to status: 'ToPay'`);
  },

  async down(db) {
    // Convert status: 'Paid' back to verified: true
    await db.collection('invoices').updateMany(
      { status: 'Paid' },
      {
        $set: { verified: true },
        $unset: { status: '' }
      }
    );

    // Convert status: 'ToPay' back to verified: false
    await db.collection('invoices').updateMany(
      { status: 'ToPay' },
      {
        $set: { verified: false },
        $unset: { status: '' }
      }
    );
  }
};
