import {Error} from '../../../errors/error';

export interface OnlyOneOfEachAddressTypeAllowedError extends Error {
  Code: 'Only1OfEachAddressTypeAllowed';
  Description: 'Only 1 of each address type is allowed';
}
