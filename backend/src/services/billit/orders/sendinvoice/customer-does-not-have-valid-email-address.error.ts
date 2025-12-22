import {Error} from '../../errors/error';

export interface CustomerDoesNotHaveValidEmailAddressError extends Error {
  Code: 'TheCustomer_0_DoesNotHaveAValidEmailAddress';
}
