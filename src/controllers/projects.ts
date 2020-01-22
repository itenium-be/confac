import {Request, Response} from 'express';
import {ProjectsCollection, ProjectsPerMonthCollection} from '../models/projects';

export const getProjects = async (req: Request, res: Response) => {
  const projects = await ProjectsCollection.find();
  return res.send(projects);
};

export const getProjectsPerMonth = async (req: Request, res: Response) => {
  const projectsPerMonth = await ProjectsPerMonthCollection.find();
  return res.send(projectsPerMonth);
};