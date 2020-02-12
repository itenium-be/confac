import {Request, Response} from 'express';

import {ObjectID} from 'mongodb';
import {findActiveProjectsForSelectedMonth} from './projects';
import {IProjectMonth} from '../models/projectsMonth';
import {CollectionNames} from '../models/common';
import {IProject} from '../models/projects';


export const getProjectsPerMonth = async (req: Request, res: Response) => {
  const projectsPerMonth = await req.db.collection(CollectionNames.PROJECTS_MONTH).find()
    .toArray();
  return res.send(projectsPerMonth);
};



/** Create all projectMonths for the specified month */
export const createProjectsMonth = async (req: Request, res: Response) => {
  const {month}: {month: string;} = req.body;

  const projects = await req.db.collection<IProject>(CollectionNames.PROJECTS).find()
    .toArray();
  const activeProjects = findActiveProjectsForSelectedMonth(month, projects);

  const createdProjectsMonth = await Promise.all(activeProjects.map(async activeProject => {
    const projectMonth: IProjectMonth = {
      _id: new ObjectID(),
      month,
      projectId: activeProject._id,
      createdOn: new Date().toISOString(),
      verified: false,
      inbound: {
        nr: '',
        status: 'new',
      },
      timesheet: {validated: false},
    };

    const inserted = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).insertOne(projectMonth);
    const [createdProjectMonth] = inserted.ops;
    return createdProjectMonth;
  }));

  return res.send(createdProjectsMonth);
};

export const patchProjectsMonth = async (req: Request, res: Response) => {
  const {_id, ...projectMonth}: IProjectMonth = req.body;

  if (_id) {
    const inserted = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).findOneAndUpdate({_id: new ObjectID(_id)}, {$set: projectMonth}, {returnOriginal: false});
    const updatedProjectMonth = inserted.value;
    return res.send(updatedProjectMonth);
  }

  const inserted = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).insertOne({
    ...projectMonth,
    createdOn: new Date().toISOString(),
  });
  const [createdProjectMonth] = inserted.ops;

  return res.send(createdProjectMonth);
};
