import { Request, Response } from 'express';
import { ConfacRequest } from '../../models/technical';
import { IAudit } from '../../models/common';
import { ObjectID } from 'mongodb'
import { IClient } from '../../models/clients'
import { Jwt } from '../../models/technical'
import { saveClient } from '../clients'

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
}

const fakeClient: Partial<IClient> = {
  // _id: new ObjectID('xxx'),
  active: true,
  name: '',
  audit: {} as IAudit,
}


// https://github.com/shelfio/jest-mongodb
const fakeDb = {
  collection: (colName: string) => ({
    insertOne: (client: any) => Promise.resolve({ops: [client]})
  })
}


describe('clients controller :: saveClient creation', () => {
  it('sets the client.slug', async () => {
    const req = {
      user: fakeUser,
      body: {...fakeClient, name: 'Company X'},
      db: fakeDb,
    } as ConfacRequest;

    const res = {
      send: (c: IClient) => Promise.resolve(c)
    } as unknown as Response;

    const result = await saveClient(req, res);
    const createdClient = result as unknown as IClient;

    expect(createdClient.slug).toBe('company-x');
  })



  it.skip('sets the client.audit', () => {
    // TODO: Production is burning, implement this later!!
  })
})





describe.skip('clients controller :: saveClient updating', () => {
  it('should update client.audit', () => {

  })

  it('should insert full audit of the changes', () => {
    // TODO: Maybe this whole mongodb thing is a bit too much for our fakeDb...?
  })
})
