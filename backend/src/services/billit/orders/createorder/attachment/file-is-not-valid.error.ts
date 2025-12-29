import {Error} from '../../../errors/error';

export interface FileIsNotValidError extends Error {
  Code: 'TheFileIsNotValid';
  Description: 'File is not a valid file.';
}
