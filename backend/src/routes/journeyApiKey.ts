import {createHash, timingSafeEqual} from 'crypto';
import {Request, Response, NextFunction} from 'express';
import {UnauthorizedError} from './jwt';
import {ConfacRequest} from '../models/technical';

/** Hashing first keeps the comparison constant-time for keys of a different length */
const keysMatch = (provided: string, expected: string): boolean => timingSafeEqual(
  createHash('sha256').update(provided).digest(),
  createHash('sha256').update(expected).digest(),
);

export const journeyApiKeyMiddleware = (expectedKey: string) => (req: Request, _res: Response, next: NextFunction): void => {
  const providedKey = req.header('X-Api-Key');
  if (!expectedKey || !providedKey || !keysMatch(providedKey, expectedKey)) {
    return next(new UnauthorizedError('credentials_required', 'Invalid API key'));
  }

  (req as ConfacRequest).apiConsumer = 'Journey';
  return next();
};
