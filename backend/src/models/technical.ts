import {Request} from 'express';
import { Server } from 'socket.io';

export type Jwt = {
  data: {
    _id: string;
    email: string;
    firstName: string;
    name: string;
    alias: string;
    active: true;
  };
  iat: number;
  exp: number;
}

export interface ConfacRequest extends Request {
  user: Jwt;
}
