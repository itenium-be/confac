module.exports = {
  async up(db) {
    db.collection('config').updateOne({key: 'conf'}, {
      $set: {
        'company.city': 'Londerzeel',
        'company.postalCode': '1840'
      }
    });

    const invoices = await db.collection('invoices').find().toArray();
    invoices.forEach((doc) => {
      const input = doc.your.city;
      if (input) {
        const regex = /^(\d+)\s(.+)$/;
        const result = input.match(regex);
        if (result) {
          const postalCode = result[1];
          const city = result[2];
          const filter= {_id: doc._id};
          const update = { $set: { 'your.city': city, 'your.postalCode': postalCode }}
          db.collection('invoices').updateOne(filter, update)
        } else {
          console.log(`Could not match your.city for invoice ${doc.number} city was '${doc.your.city}' (${doc._id})`);
        }
      }
    })
  },

  async down(db) {}
};
