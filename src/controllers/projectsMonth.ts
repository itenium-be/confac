import {Request, Response} from 'express';
import {ObjectID} from 'mongodb';
import {findActiveProjectsForSelectedMonth} from './projects';
import {IProjectMonth, IProjectMonthOverview, TimesheetCheckAttachmentType} from '../models/projectsMonth';
import {CollectionNames, createAudit, updateAudit} from '../models/common';
import {IProject} from '../models/projects';
import {ConfacRequest} from '../models/technical';


export const getProjectsPerMonthController = async (req: Request, res: Response) => {
  const projectsPerMonth = await req.db.collection(CollectionNames.PROJECTS_MONTH).find()
    .toArray();
  return res.send(projectsPerMonth);
};

/** Returns only file details of a projects month attachment overview (all timesheets combined in one file) */
export const getProjectsPerMonthOverviewController = async (req: Request, res: Response) => {
  const projectsPerMonthOverview = await req.db.collection<IProjectMonthOverview>(CollectionNames.ATTACHMENTS_PROJECT_MONTH_OVERVIEW)
    .find({}, {projection: {[TimesheetCheckAttachmentType]: false}})
    .toArray();
  return res.send(projectsPerMonthOverview);
};



/** Create all projectMonths for the specified month */
export const createProjectsMonthController = async (req: ConfacRequest, res: Response) => {
  const {month}: {month: string;} = req.body;

  const projects = await req.db.collection<IProject>(CollectionNames.PROJECTS).find()
    .toArray();
  const activeProjects = findActiveProjectsForSelectedMonth(month, projects);

  const createdProjectsMonth = await Promise.all(activeProjects.map(async activeProject => {
    const projectMonth: IProjectMonth = {
      _id: new ObjectID(),
      month,
      projectId: activeProject._id,
      audit: createAudit(req.user),
      verified: false,
      inbound: {
        nr: '',
        status: 'new',
      },
      timesheet: {validated: false},
      attachments: [],
    };

    const inserted = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).insertOne(projectMonth);
    const [createdProjectMonth] = inserted.ops;
    return createdProjectMonth;
  }));

  return res.send(createdProjectsMonth);
};



export const patchProjectsMonthController = async (req: ConfacRequest, res: Response) => {
  const {_id, ...projectMonth}: IProjectMonth = req.body;

  if (_id) {
    projectMonth.audit = updateAudit(projectMonth.audit, req.user);
    const projMonthCollection = req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH);
    const inserted = await projMonthCollection.findOneAndUpdate({_id: new ObjectID(_id)}, {$set: projectMonth}, {returnOriginal: false});
    const updatedProjectMonth = inserted.value;
    return res.send(updatedProjectMonth);
  }

  const inserted = await req.db.collection<IProjectMonth>(CollectionNames.PROJECTS_MONTH).insertOne({
    ...projectMonth,
    audit: createAudit(req.user),
  });
  const [createdProjectMonth] = inserted.ops;

  return res.send(createdProjectMonth);
};



export const deleteProjectsMonthController = async (req: ConfacRequest, res: Response) => {
  const id = req.body.id;
  await req.db.collection(CollectionNames.PROJECTS_MONTH).findOneAndDelete({ _id: new ObjectID(id) });
  await req.db.collection(CollectionNames.ATTACHMENTS_PROJECT_MONTH).findOneAndDelete({ _id: new ObjectID(id) });
  return res.send(id);
};
