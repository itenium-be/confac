import {Address} from './address';
import {PartyType} from './party-type';
import {Identifier} from './identifier';

export interface Customer {
  Name?: string;
  VATNumber?: string;
  PartyType?: PartyType;
  Identifiers?: Identifier[];
  Addresses?: Address[];
  Email?: string;
  /**
   * We have only defined email templates for NL / EN
   * If we send a different Language then Billit uses
   * AI to translate the email (the automatic English
   * translation was just wrong...)
   */
  Language?: 'NL' | 'EN';
}
