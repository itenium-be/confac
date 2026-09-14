import {Request, Response} from 'express';
import {CollectionNames} from '../models/common';
import {IProject} from '../models/projects';
import {IConsultant} from '../models/consultants';
import {IClient} from '../models/clients';
import {IUser} from '../models/user';
import {getJourneyProjects} from '../services/public-api/project-export';

export const getPublicProjectsController = async (req: Request, res: Response) => {
  const [projects, consultants, users, clients] = await Promise.all([
    req.db.collection<IProject>(CollectionNames.PROJECTS).find().toArray(),
    req.db.collection<IConsultant>(CollectionNames.CONSULTANTS).find().toArray(),
    req.db.collection<IUser>(CollectionNames.USERS).find().toArray(),
    req.db.collection<IClient>(CollectionNames.CLIENTS).find().toArray(),
  ]);

  return res.send(getJourneyProjects(projects, consultants, users, clients));
};
