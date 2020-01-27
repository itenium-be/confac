import {Router} from 'express';
import {getProjects, getProjectsPerMonth, createProject, createProjectsMonth} from '../controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', createProject);

projectsRouter.get('/month', getProjectsPerMonth);
projectsRouter.post('/month', createProjectsMonth);

export default projectsRouter;
