import {Request, Response} from 'express';
import moment from 'moment';
import {ProjectsCollection} from '../models/projects';
import {findActiveProjectsForSelectedMonth} from './projects';
import {ProjectsPerMonthCollection, IProjectMonth} from '../models/projectsMonth';


export const getProjectsPerMonth = async (req: Request, res: Response) => {
  const projectsPerMonth = await ProjectsPerMonthCollection.find();
  return res.send(projectsPerMonth);
};



/** Create all projectMonths for the specified month */
export const createProjectsMonth = async (req: Request, res: Response) => {
  const {month}: {month: string;} = req.body;

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



export const patchProjectsMonth = async (req: Request, res: Response) => {
  const {_id, ...project}: IProjectMonth = req.body;

  if (_id) {
    const updatedProject = await ProjectsPerMonthCollection.findByIdAndUpdate({_id}, project, {new: true});
    return res.send(updatedProject);
  }

  const createdProject = await ProjectsPerMonthCollection.create({
    ...project,
    createdOn: new Date().toISOString(),
  });
  return res.send(createdProject);
};
