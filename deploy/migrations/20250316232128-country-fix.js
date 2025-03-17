module.exports = {
  async up(db) {
    await db.collection('clients').updateMany({country:'België'}, { $set: { country: 'BE'}});
    await db.collection('clients').updateMany({country:'Nederland'}, { $set: { country: 'NL'}});
    await db.collection('clients').updateMany({country:'UK'}, { $set: { country: 'GB'}});
    await db.collection('clients').updateMany({country:'Duitsland'}, { $set: { country: 'DE'}});
    await db.collection('clients').updateMany({country:'Frankrijk'}, { $set: { country: 'FR'}});
  },

  async down(db) {}
};
