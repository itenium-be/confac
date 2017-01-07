var mongodb = require('mongodb');

exports.up = function(db, next) {
  var clients = db.collection('clients');
  clients.insert({
    name: '4D CAM BVBA',
    address: 'Beekveldstraat 67 bus1',
    city: '9300 Aalst',
    telephone: '054 / 80 45 03',
    btw: '0478.378.759',
    rate: {
      hourly: 50,
      description: 'Crm'
    },
    invoiceFileName: '{date:YYYY-MM} - {nr:4} - 4DCAM'
  }, next);

  clients.insert({
    name: 'Nexios Consulting Group NV',
    address: 'Telecom Gardens – Medialaan 36',
    city: 'B-1800 Vilvoorde',
    telephone: '054 / 80 45 03',
    btw: 'BE0478.895.136',
    rate: {
      hourly: 65,
      description: 'PitStop'
    },
    invoiceFileName: '{date:YYYY-MM} - {nr:4} - Macadam-Nexios'
  }, next);
};


exports.down = function(db, next) {
  next();
};
