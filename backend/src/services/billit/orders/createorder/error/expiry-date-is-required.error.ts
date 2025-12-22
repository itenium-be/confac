import {Error} from '../../../errors/error';

export interface ExpiryDateIsRequiredError extends Error {
  Code: 'ExpiryDateIsRequired';
  Description: 'Due date is a required field';
}
