import {Router} from 'express';
import {getProjects, getProjectsPerMonth, createProjectsMonth} from '../controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);

projectsRouter.get('/month', getProjectsPerMonth);
projectsRouter.post('/month', createProjectsMonth);

export default projectsRouter;
