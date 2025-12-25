import {Error} from './error';

export interface GenericError extends Error {
  Code: 'GenericError';
}
