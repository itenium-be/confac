var mongodb = require('mongodb');

exports.up = function(db, next) {
  var config = db.collection('config');
  config.insert({
    name: 'pongit',
    nextInvoiceNumber: 11,
    company: {
      name: 'pongit BVBA',
      address: 'Doolhofstraat 37',
      city: '9300 Aalst',
      btw: '0662.755.072',
      bank: 'Belfius',
      iban: 'BE04 0689 0602 8931',
      bic: 'GKCCBEBB',
      telephone: '0476 / 40 35 02',
      email: 'woutervs@hotmail.com'
    }
  }, next);
};


exports.down = function(db, next) {
  next();
};