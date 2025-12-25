import {Error} from '../../../errors/error';

export interface OrderTypeCodeIsInvalidError extends Error {
  Code: 'TheOrderTypeCode_0_IsInvalid';
}
