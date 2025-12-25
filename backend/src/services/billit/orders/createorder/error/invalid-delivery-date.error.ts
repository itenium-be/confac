import {Error} from '../../../errors/error';

export interface InvalidDeliveryDateError extends Error {
  Code: 'InvalidDeliveryDate';
  Description: 'InvalidDeliveryDate';
}
