import {Router} from 'express';
import {getProjects, getProjectsPerMonth, createProject} from '../controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', createProject);

projectsRouter.get('/month', getProjectsPerMonth);

export default projectsRouter;
