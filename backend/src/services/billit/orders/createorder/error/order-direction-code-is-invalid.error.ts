import {Error} from '../../../errors/error';

export interface OrderDirectionCodeIsInvalidError extends Error {
  Code: 'TheOrderDirectionCode_0_IsInvalid';
}
