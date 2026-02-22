/* eslint-disable object-curly-newline */
// Exercises 2:
// In memory mongodb testing
// https://github.com/nodkz/mongodb-memory-server
// https://github.com/shelfio/jest-mongodb (not used here)

import {Response} from 'express';
import {Db, MongoClient} from 'mongodb';
// import {MongoMemoryServer} from 'mongodb-memory-server';
import {SocketServerMock} from 'socket.io-mock-ts';
import {IAudit} from '../../models/common';
import {Jwt, ConfacRequest} from '../../models/technical';
// import {saveConsultant} from '../consultants';
import {IConsultant} from '../../models/consultants';

const fakeUser: Jwt = {
  data: {_id: '_id', email: 'string', firstName: 'first', name: 'name', alias: 'alias', active: true},
  iat: 0, exp: 0,
};

const fakeConsultant: Partial<IConsultant> = {
  _id: undefined,
  firstName: '',
  name: '',
  audit: {} as IAudit,
};

const _createFakeRequestAndResponse = (db: Db, consultant: Partial<IConsultant> | null = null) => {
  const req = {
    user: fakeUser,
    body: {...fakeConsultant, ...(consultant || {})},
    db,
    io: new SocketServerMock() as any,
  } as ConfacRequest;

  const res = {
    send: (c: IConsultant) => Promise.resolve(c),
  } as unknown as Response;

  return {req, res};
};

describe('consultants controller :: saveConsultant', () => {
  // let mongoServer: MongoMemoryServer;
  let _connection: MongoClient;
  let _db: Db;

  beforeAll(async () => {
    // Setting up the in-memory mongo:
    // Ideally this is done in a globalSetup/Teardown:
    // https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners
    // mongoServer = await MongoMemoryServer.create();
    // const uri = mongoServer.getUri();
    // connection = await MongoClient.connect(uri, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });
    // db = connection.db('consultants');
  });

  beforeEach(async () => {
    // Clean the db for each run?
    // await db.collection('consultants').deleteMany({});
  });

  describe('creating a consultant', () => {
    // it('sets the consultant.slug', async () => {
    //   const {req, res} = createFakeRequestAndResponse(db, {firstName: 'Tom', name: 'Tomassen'});

    //   const result = await saveConsultant(req, res);
    //   const createdConsultant = result as unknown as IConsultant;

    //   expect(createdConsultant.slug).toBe('tom-tomassen');
    // })

    // it('creates a consultant._id', async () => {
    //   const {req, res} = createFakeRequestAndResponse(db);

    //   expect(req.body._id).toBeFalsy();

    //   const result = await saveConsultant(req, res);
    //   const createdConsultant = result as unknown as IConsultant;

    //   expect(createdConsultant._id).toBeTruthy();
    // })

    it.skip('checks that the record has actually been inserted in the db', async () => {

    });

    it.skip('checks that the db record has expected name and firstName', async () => {

    });
  });

  describe.skip('updating a consultant', () => {
    it('updates a consultant when it has an _id', () => {

    });

    it('saves an audit record', () => {

    });
  });

  // afterAll(async () => {
  //   await connection.close();
  //   await mongoServer.stop();
  //   // await mongoServer.cleanup();
  // });
});
