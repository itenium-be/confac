 
import express, {Request, Response, NextFunction} from 'express';
import {MongoClient} from 'mongodb';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';

import 'express-async-errors';

import appConfig, {IConfig} from './config';
import appRouter from './routes';
import {logger} from './logger';


const app = express();
const server = http.createServer(app);

const corsOptions = {
  origins: '*', // TODO allow frontend only.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-socket-id'],
  credentials: true,
};

const io = new Server(server, {cors: corsOptions});

app.use(cors(corsOptions));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true}));
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
  logger.warn('ATTN: Running against unsecured mongodb');
  connectionString = `mongodb://${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.db}`;
}

const opts = {authSource: 'admin', useUnifiedTopology: true};
const MAX_CONNECT_ATTEMPTS = 10;
let _MongoClient: MongoClient;

const connectToMongoWithRetry = async (): Promise<MongoClient> => {
  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
    try {
      const client = await MongoClient.connect(connectionString, opts);
      logger.info(`Successfully connected to the database on attempt ${attempt}`);
      return client;
    } catch (err) {
      if (attempt === MAX_CONNECT_ATTEMPTS) {
        logger.error(`Could not connect to the database after ${MAX_CONNECT_ATTEMPTS} attempts. Exiting. More info: ${err}`);
        process.exit(1);
      }
      const delay = Math.min(30_000, 1000 * 2 ** (attempt - 1));
      logger.warn(`Mongo connect attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} failed, retrying in ${delay}ms: ${err}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('unreachable');
};


app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = _MongoClient.db();
  req.io = io;
  next();
});



app.use('/api', appRouter);


interface HttpError extends Error {
  name: string;
  code?: string;
  status?: number;
}

app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    // TODO: when "UnauthorizedError: jwt expired" should check this on the frontend
    //       and then redirect to the login page instead...
    logger.warn('UnauthorizedError', err);
    res.status(401).send({message: err.code});
    return;
  }

  logger.error(err);
  res.status(500).send({message: err.message, stack: err.stack});
});



// Serving the index.html for all 404s - only used when deployed:
logger.info(`__dirname=${__dirname}`); // === "/home"
app.use((req: Request, res: Response) => res.sendFile('/home/public/index.html'));
// app.use((req: Request, res: Response) => res.sendFile('./public/index.html', {root: __dirname}));



(async () => {
  _MongoClient = await connectToMongoWithRetry();

  server.listen(appConfig.server.port, () => {
    logger.info(`Server connected to port ${appConfig.server.port}, running in a ${appConfig.ENVIRONMENT} environment.`);
    const safeConfig: IConfig = {
      ...appConfig,
      db: {...appConfig.db, pwd: '***'},
      email: {...appConfig.email, pass: '***'},
      security: {...appConfig.security, secret: '***'},
      jwt: {...appConfig.jwt, secret: '***'},
    };
    logger.info(safeConfig);
  });
})();
