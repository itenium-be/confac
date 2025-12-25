import {Error} from '../../../../errors/error';

export interface IdentifierTypeIsRequiredError extends Error {
  Code: 'IdentifierTypeIsRequired';
  Description: 'Identifier type is require';
}
