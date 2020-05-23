import {Request, Response} from 'express';
import moment from 'moment';
import {ObjectID} from 'mongodb';
import {IProject} from '../models/projects';
import {CollectionNames, createAudit, updateAudit} from '../models/common';
import {ConfacRequest} from '../models/technical';

export const findActiveProjectsForSelectedMonth = (selectedMonth: string, projects: IProject[]) => projects.filter(project => {
  if (project.endDate) {
    const isStartDateInSameMonthOrBefore = moment(project.startDate).isSameOrBefore(selectedMonth, 'months');
    const isEndDateInSameMonthOrAfter = moment(project.endDate).isSameOrAfter(selectedMonth, 'months');
    return isStartDateInSameMonthOrBefore && isEndDateInSameMonthOrAfter;
  }

  return moment(project.startDate).isSameOrBefore(selectedMonth, 'months');
});


export const getProjects = async (req: Request, res: Response) => {
  const projects = await req.db.collection<IProject>(CollectionNames.PROJECTS).find().toArray();
  return res.send(projects);
};


export const saveProject = async (req: ConfacRequest, res: Response) => {
  const {_id, ...project}: IProject = req.body;

  if (project.partner
    && !project.partner.clientId
    && (!project.partner.defaultInvoiceLines.length || !project.partner.defaultInvoiceLines[0].price)
    && !project.partner.ref) {

    project.partner = undefined;
  }

  if (_id) {
    project.audit = updateAudit(project.audit, req.user);
    const projectsCollection = req.db.collection<IProject>(CollectionNames.PROJECTS);
    const inserted = await projectsCollection.findOneAndUpdate({_id: new ObjectID(_id)}, {$set: project}, {returnOriginal: false});
    const updatedProject = inserted.value;
    return res.send(updatedProject);
  }

  const inserted = await req.db.collection<Omit<IProject, '_id'>>(CollectionNames.PROJECTS).insertOne({
    ...project,
    audit: createAudit(req.user),
  });
  const [createdProject] = inserted.ops;
  return res.send(createdProject);
};
