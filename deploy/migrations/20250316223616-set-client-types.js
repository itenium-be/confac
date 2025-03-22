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
        return;
      }

      console.log(`Client ${client.name}: adding type ${type} to [${clientTypes.join(', ')}]`);
      clientTypes.push(type);
      const update = { $set: {types: clientTypes} };
      await db.collection('clients').updateOne({ _id: objectid(clientid) }, update);
    }

    const projects = await db.collection('projects').find().toArray();
    projects.forEach(async project => {
      if (project?.client?.clientId) {
        await addTypeToClient(project, project.client.clientId, 'endCustomer');
      }
      if (project?.partner?.clientId) {
        await addTypeToClient(project, project.partner.clientId, 'partner');
      }

      // endCustomer is new, this isn't filled in for any project
      // if (project?.endCustomer?.clientId) {
      //   await addTypeToClient(project, project.endCustomer.clientId, 'endCustomer');
      // }
    });
  },

  async down(db) {}
};
