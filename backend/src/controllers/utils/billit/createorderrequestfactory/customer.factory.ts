import {IClient} from '../../../../models/clients';
import {Customer} from '../../../../services/billit';
import {fromClient as getVatNumber} from '../vat-number.factory';

export function fromClient(client: IClient): Customer {
  return {
    Name: client.name,
    VATNumber: getVatNumber(client),
    PartyType: 'Customer',
    Addresses: [
      {
        AddressType: 'InvoiceAddress',
        Name: client.name,
        Street: client.street,
        StreetNumber: client.streetNr,
        Box: client.streetBox,
        City: client.city,
        Zipcode: client.postalCode,
        CountryCode: client.country,
      },
    ],
    Email: client.email.to,
    Language: client.language?.toUpperCase() || 'EN',
  };
}
