import {describe, it, expect} from 'vitest';
import {buildClient} from '../buildClient';
import {ClientRow} from '../../types';

const sampleRow: ClientRow = {
  slug: 'test-bv',
  name: 'Test BV',
  btw: 'BE 0123.456.789',
  street: 'Teststraat',
  streetNr: '1',
  postalCode: '1000',
  city: 'Brussel',
  country: 'BE',
  language: 'nl',
  contact: 'Jan Peeters',
  telephone: '02 123 45 67',
};

describe('buildClient', () => {
  it('routes email.to to @pongit.be based on slug', () => {
    const client = buildClient(sampleRow, 'client');
    expect(client.email.to).toBe('test-bv@pongit.be');
  });

  it('tags client with the given type', () => {
    const partner = buildClient(sampleRow, 'partner');
    const endCustomer = buildClient(sampleRow, 'endCustomer');
    expect(partner.types).toEqual(['partner']);
    expect(endCustomer.types).toEqual(['endCustomer']);
  });

  it('uses per-type default invoice line price', () => {
    const client = buildClient(sampleRow, 'client');
    const partner = buildClient(sampleRow, 'partner');
    const endCustomer = buildClient(sampleRow, 'endCustomer');
    expect(client.defaultInvoiceLines[0].price).toBe(550);
    expect(partner.defaultInvoiceLines[0].price).toBe(480);
    expect(endCustomer.defaultInvoiceLines[0].price).toBe(0);
  });

  it('enables peppol for BE entries by default', () => {
    const be = buildClient({...sampleRow, country: 'BE'}, 'client');
    const fr = buildClient({...sampleRow, country: 'FR'}, 'client');
    expect(be.peppolEnabled).toBe(true);
    expect(fr.peppolEnabled).toBe(false);
  });

  it('honours explicit peppolEnabled override', () => {
    const c = buildClient({...sampleRow, country: 'BE', peppolEnabled: false}, 'client');
    expect(c.peppolEnabled).toBe(false);
  });

  it('stamps audit with createdBy faker', () => {
    const c = buildClient(sampleRow, 'client');
    expect(c.audit.createdBy).toBe('faker');
    expect(c.audit.createdOn).toBeTruthy();
  });

  it('defaults frameworkAgreement status to BothSigned', () => {
    const c = buildClient(sampleRow, 'client');
    expect(c.frameworkAgreement.status).toBe('BothSigned');
  });
});
