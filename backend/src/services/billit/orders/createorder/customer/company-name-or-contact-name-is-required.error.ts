import {Error} from '../../../errors/error';

export interface CompanyNameOrContactNameIsRequiredError extends Error {
  Code: 'CompanyNameOrContactNameIsRequired';
  Description: 'Corporate name or contact is a required field.';
}
