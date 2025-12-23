import {IClient} from '../../../../models/clients';
import {Customer} from '../../../../services/billit';

export function fromClient(client: IClient): Customer {
  const {
    name: Name,
    address,
    city: City,
    postalCode: Zipcode,
    country: CountryCode,
  } = client;

  return {
    Name,
    VATNumber: getVatNumber(client),
    PartyType: 'Customer',
    Addresses: [
      {
        AddressType: 'InvoiceAddress',
        Name,
        Street: address,
        // StreetNumber: '', TODO: Split street and street number from address
        City,
        Zipcode,
        CountryCode,
      },
    ],
  };
}

function getVatNumber(client: IClient): string {
  return client.btw
    .replace(/\s/g, '') // Strip spaces
    .replace(/\./g, ''); // Strip dots
}
