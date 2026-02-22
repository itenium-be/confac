// Exercises 4:
// Bringing it all together
// https://github.com/ladjs/supertest
// https://github.com/ladjs/superagent

import express, {NextFunction, Request, Response} from 'express';
import {Db, MongoClient} from 'mongodb';
// import {MongoMemoryServer} from 'mongodb-memory-server';
// import request from 'supertest';
import bodyParser from 'body-parser';
import {SocketServerMock} from 'socket.io-mock-ts';
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
  let _connection: MongoClient;

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


  // DELETE deleteProjectsMonthController
  // describe.skip('deleteProjectsMonthController', () => {
  //   it('it deletes the projectMonth', async () => {
  //     const res = await request(app)
  //       .delete('/month')
  //       .expect(200);
  //   });

  //   it('also deletes the attachment', () => {})
  // })


  // POST createProjectsMonthController
  describe('createProjectsMonthController', () => {
    it('... creates them?', () => {});
  });


  // PATCH patchProjectsMonthController
  describe('patchProjectsMonthController', () => {
    it('update the db', () => {});
    it('sets the audit on insert/update', () => {});
    it('saves property updates to the db', () => {});
  });

  // afterAll(async () => {
  //   await connection.close();
  // });
});
