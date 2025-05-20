// Exercises 3:
// Bringing it all together with supertest
// Mocking Express with supertest
// https://github.com/ladjs/supertest
// https://github.com/ladjs/superagent

import express, {NextFunction, Request, Response} from 'express';
import {Db, MongoClient} from 'mongodb';
// import {MongoMemoryServer} from 'mongodb-memory-server';
import request from 'supertest'; // eslint-disable-line import/no-extraneous-dependencies
import bodyParser from 'body-parser';
import {SocketServerMock} from 'socket.io-mock-ts'; // eslint-disable-line import/no-extraneous-dependencies
import projectsRouter from '../../routes/projects';



const getFakeDb: jest.Mock<Db> = jest.fn();

const app = express();
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.db = getFakeDb();
  req.io = new SocketServerMock() as any;
  next();
});
app.use('/', projectsRouter);



describe('projectsMonth controller', () => {
  let connection: MongoClient;

  // beforeAll(async () => {
  //   // Setup fake mongo
  //   const mongoServer = await MongoMemoryServer.create();
  //   const uri = mongoServer.getUri();
  //   connection = await MongoClient.connect(uri, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  //   const db = await connection.db('projects_month');

  //   // Make sure our Express middleware uses our fake db
  //   getFakeDb.mockReturnValue(db);
  // });

  // beforeEach(async () => {})

  // it('/month gets the last ?months=3 projectMonths', async () => {
  //   const res = await request(app)
  //     .get('/month?months=3')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/);

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.length).toBe(0);
  // });

  it.skip('/month doesnt return older records', () => {});

  // afterAll(async () => {
  //   await connection.close();
  // });
});
