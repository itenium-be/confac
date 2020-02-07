import {Request, Response} from 'express';
import moment from 'moment';
import {ProjectsCollection, IProject} from '../models/projects';


export const findActiveProjectsForSelectedMonth = (selectedMonth: string, projects: IProject[]) => projects.filter(project => {
  if (project.endDate) {
    const isStartDateInSameMonthOrBefore = moment(project.startDate).isSameOrBefore(selectedMonth, 'months');
    const isEndDateInSameMonthOrAfter = moment(project.endDate).isSameOrAfter(selectedMonth, 'months');
    return isStartDateInSameMonthOrBefore && isEndDateInSameMonthOrAfter;
  }

  return moment(project.startDate).isSameOrBefore(selectedMonth, 'months');
});


export const getProjects = async (req: Request, res: Response) => {
  const projects = await ProjectsCollection.find();
  return res.send(projects);
};


export const saveProject = async (req: Request, res: Response) => {
  const {_id, ...project}: IProject = req.body;

  if (_id) {
    const updatedProject = await ProjectsCollection.findByIdAndUpdate({_id}, project);
    return res.send(updatedProject);
  }
  const createdProject = await ProjectsCollection.create({
    ...project,
    createdOn: new Date().toISOString(),
  });
  return res.send(createdProject);
};
