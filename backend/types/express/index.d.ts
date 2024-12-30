import {Db} from 'mongodb';
import { Server } from 'socket.io';

declare global {
  namespace Express {
    export interface Request {
      db: Db;
      io: Server
    }
  }
}
