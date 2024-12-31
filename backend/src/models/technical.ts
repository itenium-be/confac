import {Request} from 'express';

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
