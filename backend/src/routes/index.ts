import {Response, NextFunction, Router} from 'express';
import jwt from 'express-jwt';
import {v4 as uuidv4} from 'uuid';
import config from '../config';
import {logger} from '../logger';


import {ConfacRequest} from '../models/technical';
import clientsRouter from './clients';
import consultantsRouter from './consultants';
import projectsRouter from './projects';
import invoicesRouter from './invoices';
import configRouter from './config';
import attachmentsRouter from './attachments';
import userRouter from './user';

const appRouter = Router();

const jwtMiddleware = () => jwt({
  secret: config.jwt.secret,
  getToken: req => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
});


const fakeUserMiddleware = (req: any, res: any, next: any) => {
  if (!req.user?.data) {
    let name = req.header('Authorization') || 'Jane Doe';
    name = name.replace(/^Bearer /, '');

    req.user = {
      iat: 0,
      exp: 0,
      data: {
        _id: name,
        email: `${name}@itenium.be`,
        name: 'X',
        firstName: name,
        alias: name,
        active: true,
      },
    };
  }
  next();
};



const useLogger = (req: any, res: Response, next: NextFunction) => {
  const start = Date.now();

  const confacReq = req as ConfacRequest;
  const user = confacReq.user?.data?.alias ?? confacReq.user?.data?._id;
  req.logger = logger.child({
    UserName: user || 'Anonymous',
    RequestId: req.headers['x-correlation-id'] || uuidv4(),
  });

  const baseLog = `${req.method} ${req.originalUrl.split('?')[0]}`;
  let log = baseLog;

  const filteredQuery = {...req.query};
  delete filteredQuery.token;
  const hasQuery = filteredQuery && Object.keys(filteredQuery).length > 0;
  if (hasQuery) {
    log += ` - Query: ${JSON.stringify(filteredQuery)}`;
  }
  if (req.body && Object.keys(req.body).length > 0) {
    if (!hasQuery) {
      log += ` - Body: ${JSON.stringify(req.body)}`;
    } else {
      log += `, Body: ${JSON.stringify(req.body)}`;
    }
  }
  req.logger.info(log);

  next();

  const duration = Date.now() - start;
  log = `${baseLog} in ${duration}ms`;
  req.logger.info(log);
};



const withSecurity = !!config.security.clientId;
if (withSecurity) {
  logger.info('Starting WITH security');
  appRouter.use('/user', jwtMiddleware().unless({path: ['/api/user/login']}), useLogger, userRouter);
  appRouter.use('/clients', jwtMiddleware(), useLogger, clientsRouter);
  appRouter.use('/consultants', jwtMiddleware(), useLogger, consultantsRouter);
  appRouter.use('/projects', jwtMiddleware(), useLogger, projectsRouter);
  appRouter.use('/invoices', jwtMiddleware(), useLogger, invoicesRouter);
  appRouter.use('/config', jwtMiddleware().unless({path: ['/api/config/security']}), useLogger, configRouter);
  appRouter.use('/attachments', jwtMiddleware(), useLogger, attachmentsRouter);
} else {
  appRouter.use(fakeUserMiddleware);

  logger.warn('Starting WITHOUT security');
  appRouter.use('/user', useLogger, userRouter);
  appRouter.use('/clients', useLogger, clientsRouter);
  appRouter.use('/consultants', useLogger, consultantsRouter);
  appRouter.use('/projects', useLogger, projectsRouter);
  appRouter.use('/invoices', useLogger, invoicesRouter);
  appRouter.use('/config', useLogger, configRouter);
  appRouter.use('/attachments', useLogger, attachmentsRouter);
}




export default appRouter;
