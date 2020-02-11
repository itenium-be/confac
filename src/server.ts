/* eslint-disable no-console */
import express, {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import sgMail from '@sendgrid/mail';
import errorHandler from 'errorhandler'; // TODO: This is probably going to crash on the CI?
import {MongoClient} from 'mongodb';
import cors from 'cors';

import appConfig from './config';
import appRouter from './routes';

const app = express();

sgMail.setApiKey(appConfig.SENDGRID_API_KEY);

if (appConfig.ENVIRONMENT === 'development') {
  app.use(errorHandler());
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`./${appConfig.server.basePath}public`));

if (appConfig.ENABLE_ROOT_TEMPLATES) {
  app.use(express.static('/templates'));
} else {
  app.use(express.static(`./${appConfig.server.basePath}templates`));
}

const connectionString = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.db}`;
let _MongoClient: MongoClient;
MongoClient.connect(connectionString, {useUnifiedTopology: true}).then(client => {
  console.log('Successfully connected to the database!');
  _MongoClient = client;
})
  .catch(err => console.log(`Could not connect to the database. More info: ${err}`));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = _MongoClient.db();
  next();
});

app.use('/api', appRouter);

app.use((req: Request, res: Response) => res.status(404).send('Page not found!'));

app.listen(appConfig.server.port, () => {
  console.log(`Server connected to port ${appConfig.server.port}, running in a ${appConfig.ENVIRONMENT} environment.`);
  // console.log(JSON.stringify(config))
});
