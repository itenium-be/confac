import {fromClient} from '../customer.factory';
import {Customer} from '../../../../../services/billit';
import {IClient} from '../../../../../models/clients';
import {someClient} from './client.fixture';

describe('fromClient', () => {
  it('should create Customer from client with full data', () => {
    const client: IClient = {
      ...someClient,
      name: 'Test Company BV',
      address: 'Main Street 5',
      city: 'Brussels',
      postalCode: '1000',
      country: 'BE',
      btw: 'BE 0123.456.789',
    };

    const expected: Customer = {
      Name: 'Test Company BV',
      VATNumber: 'BE0123456789',
      PartyType: 'Customer',
      Addresses: [
        {
          AddressType: 'InvoiceAddress',
          Name: 'Test Company BV',
          Street: 'Main Street 5',
          City: 'Brussels',
          Zipcode: '1000',
          CountryCode: 'BE',
        },
      ],
    };

    const actual: Customer = fromClient(client);

    expect(actual).toEqual(expected);
  });
});
