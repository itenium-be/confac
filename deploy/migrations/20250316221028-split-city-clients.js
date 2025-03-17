module.exports = {
  async up(db) {
    const clients = await db.collection('clients').find().toArray();
    clients.forEach((doc) => {
      const input = doc.city;
      const regex = /^(\d+)\s(.+)$/;
      const result = input.match(regex);

      if (result) {
        const postalCode = result[1];
        const city = result[2];
        const filter= {_id: doc._id};
        const update = { $set: { 'city': city, 'postalCode': postalCode }}
        db.collection('clients').updateOne(filter, update)
      } else {
        console.log(`Could not match client.city for client ${doc.name} city was '${doc.city}' (${doc._id})`);
      }
    })
  },

  async down(db) {}
};
