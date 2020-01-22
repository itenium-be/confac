import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import sgMail from '@sendgrid/mail';
import errorHandler from 'errorhandler';
import cors from 'cors';

import appConfig from './config';
import appRouter from './routes';

const app = express();

sgMail.setApiKey(appConfig.SENDGRID_API_KEY);

if (appConfig.environment === 'development') {
  app.use(errorHandler());
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', appRouter);

const connectionString = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.db}`;

mongoose.connect(connectionString, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => console.log('Successfully connected to the database!'))
  .catch(err => console.log(`Could not connect to the database. More info: ${err}`));

app.listen(appConfig.server.port, () => {
  console.log(`Server connected to port ${appConfig.server.port}, running in a ${appConfig.environment} environment.`);
  // console.log(JSON.stringify(config))
});
