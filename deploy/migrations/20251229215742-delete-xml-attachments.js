module.exports = {
  async up(db) {
    // Remove the xml field from all documents in the attachments collection
    await db.collection('attachments').updateMany(
      {xml: {$exists: true}},
      {$unset: {xml: ''}}
    );
  },

  async down(db) {
    // Cannot restore deleted XML data
  }
};
