import {Error} from '../../../errors/error';

export interface ThereMustBeAtLeastOneOrderLinerError extends Error {
  Code: 'ThereMustBeAtLeastOneOrderLine';
  Description: 'You must choose at least 1 order line';
}
