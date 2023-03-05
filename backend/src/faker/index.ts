import { MongoClient } from 'mongodb';
import { insertStuff } from './insertStuff';
import * as dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  db: {
    host: process.env.MONGO_HOST || '',
    db: process.env.MONGO_DB || '',
    port: +(process.env.MONGO_PORT || 27017),
    user: process.env.MONGO_USERNAME || '',
    pwd: process.env.MONGO_PASSWORD || '',
  },
};

const dbString = `${appConfig.db.host}:${appConfig.db.port} (${appConfig.db.db})`;
console.log('Going to insert data @ ' + dbString);


let connectionString: string;
if (appConfig.db.user && appConfig.db.pwd) {
  connectionString = `mongodb://${appConfig.db.user}:${appConfig.db.pwd}@${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.db}`;
} else {
  connectionString = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.db}`;
}



const opts = {authSource: 'admin', useUnifiedTopology: true};
MongoClient.connect(connectionString, opts).then(async (client: MongoClient) => {
  console.log('Successfully connected to the database!');
  const db = client.db();

  console.log('About to insert some stuff...');
  await insertStuff(db);

  client.close();
})
.catch((err: any) => console.log(`Could not connect to the database. More info: ${err}`));

