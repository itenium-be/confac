import {Error} from './error';

export interface IdempotentTokenAlreadyExistsError extends Error {
  Code: 'Idempotent token already exists';
}
