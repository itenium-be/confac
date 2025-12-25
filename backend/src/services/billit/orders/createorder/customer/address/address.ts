import {AddressType} from './address-type';

export interface Address {
  AddressType: AddressType;
  Name?: string;
  Street?: string;
  StreetNumber?: string;
  City?: string;
  Zipcode?: string;
  Box?: string;
  Email?: string;
  Language?: string;
  CountryCode?: string;
}
