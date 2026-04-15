import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import {ConfacRequest, Jwt} from '../models/technical';

export type UnauthorizedCode = 'credentials_required' | 'invalid_token';

// server.ts checks err.name === 'UnauthorizedError' and forwards err.code to
// the frontend, which branches on data.message === 'invalid_token'. Preserve
// both so the existing logout-on-expiry flow keeps working.
export class UnauthorizedError extends Error {
  code: UnauthorizedCode;

  constructor(code: UnauthorizedCode, msg: string) {
    super(msg);
    this.name = 'UnauthorizedError';
    this.code = code;
  }
}

const extractToken = (req: Request): string | null => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length);
  }
  const q = req.query?.token;
  if (typeof q === 'string') {
    return q;
  }
  return null;
};

export const jwtMiddleware = (unlessPaths: string[] = []) => (req: Request, _res: Response, next: NextFunction): void => {
  if (unlessPaths.includes(req.originalUrl)) {
    return next();
  }

  const token = extractToken(req);
  if (!token) {
    return next(new UnauthorizedError('credentials_required', 'No authorization token was found'));
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret, {algorithms: ['HS256']});
    (req as ConfacRequest).user = payload as Jwt;
    return next();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid token';
    return next(new UnauthorizedError('invalid_token', msg));
  }
};
