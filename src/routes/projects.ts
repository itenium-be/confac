import {Router} from 'express';
import {getProjects, getProjectsPerMonth, saveProject, createProjectsMonth} from '../controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', saveProject);

projectsRouter.get('/month', getProjectsPerMonth);
projectsRouter.post('/month', createProjectsMonth);

export default projectsRouter;
