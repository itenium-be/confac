module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db) {
    console.log('Split invoice.clients.city');

    const invoices = await db.collection('invoices').find({}).toArray();
    invoices.forEach((doc) => {
      const input = doc.client.city;
      const regex = /^(\d+)\s(.+)$/;
      const result = input.match(regex);

      if (result) {
        const postalCode = result[1];
        const city = result[2];
        const update = { $set: { 'client.city': city, 'client.postalCode': postalCode }}
        db.collection('invoices').updateOne({_id: doc._id}, update)
      } else {
        console.log(`Could not match client city for invoice nr ${doc.number} client.city was '${doc.client.city}' (${doc._id})`);
      }
    })

    console.log('done');
    return;
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db) { }
};
