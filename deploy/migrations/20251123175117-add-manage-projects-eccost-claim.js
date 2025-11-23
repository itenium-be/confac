module.exports = {
  async up(db) {
    await db.collection('roles').updateOne(
      {name: 'admin'},
      {$addToSet: {claims: 'manage-projects-eccost'}}
    );
  },

  async down(db) {
    await db.collection('roles').updateOne(
      {name: 'admin'},
      {$pull: {claims: 'manage-projects-eccost'}}
    );
  }
};
