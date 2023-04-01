// Exercises 3:
// Mocking Express

import { Request, Response } from 'express';
import { Db, MongoClient } from 'mongodb';
import { ConfacRequest } from '../../models/technical';
import { IAudit } from '../../models/common';
import { ObjectID } from 'mongodb'
import { Jwt } from '../../models/technical'
import { saveConsultant } from '../consultants';
import { IConsultant } from '../../models/consultants';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IProject } from '../../models/projects';


describe('projects controller', () => {
  let mongoServer: MongoMemoryServer;
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db('projects');
  });

  beforeEach(async () => {
    // Clean the db for each run?
    // await db.collection('projects').deleteMany({});
  })

  describe('deleting a project', () => {
    it('removes the project from the collection', async () => {
      // const result = await deleteProject(req, res);

      // export const deleteProject = async (req: ConfacRequest, res: Response) => {
      //   const id = req.body.id;
      //   await req.db.collection(CollectionNames.PROJECTS).findOneAndDelete({ _id: new ObjectID(id) });
      //   return res.send(id);
      // };


    })
  })

  afterAll(async () => {
    await connection.close();
  });
})




// describe.skip('', () => {
//   it('', () => {

//   })

//   it('', () => {

//   })
// })
