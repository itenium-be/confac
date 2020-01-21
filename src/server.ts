import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import sgMail from '@sendgrid/mail';
import errorHandler from 'errorhandler';
import cors from 'cors';

import config from './config';
import appRouter from './routes';

const app = express();

sgMail.setApiKey(config.SENDGRID_API_KEY);

if (config.environment === 'development') {
  app.use(errorHandler());
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', appRouter);

const connectionString = `mongodb://${config.db.host}:${config.db.port}/${config.db.db}`;

mongoose.connect(connectionString, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => console.log('Successfully connected to the database!'))
  .catch(err => console.log(`Could not connect to the database. More info: ${err}`));

app.listen(config.server.port, () => {
  console.log(`Server connected to port ${config.server.port}, running in a ${config.environment} environment.`);
  // console.log(JSON.stringify(config))
});
