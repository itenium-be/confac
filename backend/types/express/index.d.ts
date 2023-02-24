import {Db} from 'mongodb';

declare global {
  namespace Express {
    export interface Request {
      db: Db;
    }
  }
}
