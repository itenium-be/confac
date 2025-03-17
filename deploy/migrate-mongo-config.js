// In this file you can configure migrate-mongo
// https://github.com/seppevs/migrate-mongo
require('dotenv').config();

let url = "mongodb://admin:pwd@localhost:27017/?authSource=admin&directConnection=true";
if (process.env.MONGO_USER) {
  // const server = process.env.NODE_ENV === 'development' ? 'localhost' : 'mongo';
  const server = 'localhost';
  url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${server}:${process.env.MONGO_PORT}/?authSource=admin&directConnection=true`;
}

console.log('env', process.env.NODE_ENV);
console.log('url', url);
console.log('db', process.env.MONGO_DB || "confac");

const config = {
  mongodb: {
    url,
    databaseName: process.env.MONGO_DB || "confac",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The mongodb collection where the lock will be created.
  lockCollectionName: "changelog_lock",

  // The value in seconds for the TTL index that will be used for the lock. Value of 0 will disable the feature.
  lockTtl: 0,

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: ".js",

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,

  // Don't change this, unless you know what you're doing
  moduleSystem: 'commonjs',
};

module.exports = config;
