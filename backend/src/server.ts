/* eslint-disable no-console */
import express, {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import sgMail from '@sendgrid/mail';
import {MongoClient} from 'mongodb';
import cors from 'cors';

import 'express-async-errors';

import appConfig from './config';
import appRouter from './routes';

const app = express();

sgMail.setApiKey(appConfig.SENDGRID_API_KEY);



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(`./${appConfig.server.basePath}public`));



if (appConfig.ENABLE_ROOT_TEMPLATES) {
  app.use(express.static('/templates'));
} else {
  app.use(express.static(`./${appConfig.server.basePath}templates`));
}



let connectionString: string;
if (appConfig.db.user && appConfig.db.pwd) {
  connectionString = `mongodb://${appConfig.db.user}:${appConfig.db.pwd}@${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.db}`;
} else {
  console.log('ATTN: Running against unsecured mongodb');
  connectionString = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.db}`;
}

const opts = {authSource: 'admin', useUnifiedTopology: true};
let _MongoClient: MongoClient;
MongoClient.connect(connectionString, opts).then(client => {
  console.log('Successfully connected to the database!');
  _MongoClient = client;
})
  .catch(err => console.log(`Could not connect to the database. More info: ${err}`));

app.use((req: Request, res: Response, next: NextFunction) => {
  // TODO: fix race condition
  req.db = _MongoClient.db();
  next();
});





app.use('/api', appRouter);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    console.log('UnauthorizedError', err);
    res.status(401).send({message: err.code});
    return;
  }

  console.error(err);
  res.status(500).send({message: err.message, stack: err.stack});
});



// Serving the index.html for all 404s - only used when deployed:
console.log('__dirname', __dirname); // === "/home"
app.use((req: Request, res: Response) => res.sendFile('/home/public/index.html'));
// app.use((req: Request, res: Response) => res.sendFile('./public/index.html', {root: __dirname}));



app.listen(appConfig.server.port, () => {
  console.log(`Server connected to port ${appConfig.server.port}, running in a ${appConfig.ENVIRONMENT} environment.`);
  console.log(appConfig);
});
