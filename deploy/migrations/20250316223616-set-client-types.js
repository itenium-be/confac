var objectid = require('objectid');

module.exports = {
  async up(db) {
    async function addTypeToClient(project, clientid, type) {
      const client = await db.collection('clients').findOne({ _id: objectid(clientid) });
      if (client === null) {
        console.log(`Client '${clientid}' not found on project ${project._id} (type: ${type})`);
        return;
      }

      const clientTypes = client.types || [];
      if (clientTypes.includes(type)) {
        console.log(`Client ${client.name} already has type ${type}`);
        return;
      }

      console.log(`Client ${client.name}: adding type ${type}`);
      clientTypes.push(type);
      const update = { $set: {types: clientTypes} };
      db.collection('clients').updateOne({ _id: objectid(clientid) }, update);
    }

    const projects = await db.collection('projects').find().toArray();
    projects.forEach(async project => {
      if (project?.client?.clientId) {
        await addTypeToClient(project, project.client.clientId, 'client');
      }
      if (project?.partner?.clientId) {
        await addTypeToClient(project, project.partner.clientId, 'partner');
      }
      if (project?.endCustomer?.clientId) {
        await addTypeToClient(project, project.endCustomer.clientId, 'endCustomer');
      }
    });
  },

  async down(db) {}
};
