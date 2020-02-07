import {Request, Response} from 'express';
import moment from 'moment';

import {ProjectsCollection, ProjectsPerMonthCollection, IProject, IProjectMonth} from '../models/projects';

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

export const getProjectsPerMonth = async (req: Request, res: Response) => {
  const projectsPerMonth = await ProjectsPerMonthCollection.find();
  return res.send(projectsPerMonth);
};

export const createProjectsMonth = async (req: Request, res: Response) => {
  const {month}: { month: string; } = req.body;

  const projects = await ProjectsCollection.find();

  const activeProjects = findActiveProjectsForSelectedMonth(month, projects);

  const createdProjectsMonth = await Promise.all(activeProjects.map(async activeProject => {
    const projectMonth = {
      month,
      projectId: activeProject._id,
      createdOn: new Date().toISOString(),
    } as IProjectMonth;
    const createdProjectMonth = await ProjectsPerMonthCollection.create(projectMonth);
    return createdProjectMonth;
  }));

  return res.send(createdProjectsMonth);
};
