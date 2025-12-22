import {Error} from '../../../errors/error';

export interface OrderDateIsRequiredError extends Error {
  Code: 'OrderDateIsRequired';
  Description: 'Date is a required field.';
}
