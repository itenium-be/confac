import {Address} from './address';
import {PartyType} from './party-type';
import {Identifier} from './identifier';

export interface Customer {
  Name?: string;
  VATNumber?: string;
  PartyType?: PartyType;
  Identifiers?: Identifier[];
  Addresses?: Address[];
}
