import {Error} from './error';

export interface YourVatIsNotValidError extends Error {
  Code: 'YourVATIsNotValid';
  Description: 'We think the VAT number you have provided is incorrect';
}
