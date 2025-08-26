import {Db} from 'mongodb';
import {Server} from 'socket.io';
import {Logger} from 'winston';

declare global {
  namespace Express {
    export interface Request {
      db: Db;
      io: Server;
      logger: Logger;
    }
  }
}
