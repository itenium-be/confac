// Exercises 1:
// Test an async (req, res) Express function
// With manual Express mocks

import {Response} from 'express';
import {SocketServerMock} from 'socket.io-mock-ts';
import {ConfacRequest, Jwt} from '../../models/technical';
import {IAudit} from '../../models/common';
import {IClient} from '../../models/clients';
import {saveClient} from '../clients';

const fakeUser: Jwt = {
  data: {
    _id: '_id',
    email: 'string',
    firstName: 'string',
    name: 'string',
    alias: 'string',
    active: true,
  },
  iat: 0,
  exp: 0,
};

const fakeClient: Partial<IClient> = {
  // _id: new ObjectID('xxx'),
  active: true,
  name: '',
  audit: {} as IAudit,
};


const fakeDb = {collection: (_colName: string) => ({insertOne: (client: IClient) => Promise.resolve({ops: [client]})})};


describe('clients controller :: saveClient creation', () => {
  it('sets the client.slug', async () => {
    const req = {
      user: fakeUser,
      body: {...fakeClient, name: 'Company X'},
      db: fakeDb,
      io: new SocketServerMock() as unknown as ConfacRequest['io'],
    } as ConfacRequest;

    const res = {send: (c: IClient) => Promise.resolve(c)} as unknown as Response;
    const result = await saveClient(req, res);
    const createdClient = result as unknown as IClient;

    expect(createdClient.slug).toBe('company-x');
  });



  it.skip('sets the client.audit', () => {
    // TODO: Production is burning, implement this later!!
  });
});





describe.skip('clients controller :: saveClient updating', () => {
  it('should update client.audit', () => {

  });

  it('should insert full audit of the changes', () => {
    // TODO: Maybe this whole mongodb thing is a bit too much for our fakeDb...?
    // TODO: Or could test just the saveAudit function.
  });
});
