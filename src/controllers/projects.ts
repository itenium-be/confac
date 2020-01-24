import {Request, Response} from 'express';
import {ProjectsCollection, ProjectsPerMonthCollection, IProject} from '../models/projects';

export const getProjects = async (req: Request, res: Response) => {
  const projects = await ProjectsCollection.find();
  return res.send(projects);
};

export const createProject = async (req: Request, res: Response) => {
  const project: IProject = req.body;
  const createdProject = await ProjectsCollection.create(project);
  return res.send(createdProject);
};

export const getProjectsPerMonth = async (req: Request, res: Response) => {
  const projectsPerMonth = await ProjectsPerMonthCollection.find();
  return res.send(projectsPerMonth);
};
