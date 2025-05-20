import {Router} from 'express';
import jwt from 'express-jwt';
import config from '../config';


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

const withSecurity = !!config.security.clientId;
if (withSecurity) {
  console.log('Starting WITH security'); // eslint-disable-line
  appRouter.use('/user', jwtMiddleware().unless({path: ['/api/user/login']}), userRouter);
  appRouter.use('/clients', jwtMiddleware(), clientsRouter);
  appRouter.use('/consultants', jwtMiddleware(), consultantsRouter);
  appRouter.use('/projects', jwtMiddleware(), projectsRouter);
  appRouter.use('/invoices', jwtMiddleware(), invoicesRouter);
  appRouter.use('/config', jwtMiddleware().unless({path: ['/api/config/security']}), configRouter);
  appRouter.use('/attachments', jwtMiddleware(), attachmentsRouter);
} else {
  appRouter.use(fakeUserMiddleware);

  console.log('Starting WITHOUT security'); // eslint-disable-line
  appRouter.use('/user', [], userRouter);
  appRouter.use('/clients', [], clientsRouter);
  appRouter.use('/consultants', [], consultantsRouter);
  appRouter.use('/projects', [], projectsRouter);
  appRouter.use('/invoices', [], invoicesRouter);
  appRouter.use('/config', [], configRouter);
  appRouter.use('/attachments', [], attachmentsRouter);
}




export default appRouter;
