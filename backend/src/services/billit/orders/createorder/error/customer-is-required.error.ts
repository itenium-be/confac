import {Error} from '../../../errors/error';

export interface CustomerIsRequiredError extends Error {
  Code: 'CustomerIsRequired';
  Description: 'Customer is a required field';
}
