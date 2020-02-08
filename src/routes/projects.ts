import {Router} from 'express';
import {getProjects, saveProject} from '../controllers/projects';
import {getProjectsPerMonth, createProjectsMonth, patchProjectsMonth} from '../controllers/projectsMonth';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', saveProject);

projectsRouter.get('/month', getProjectsPerMonth);
projectsRouter.post('/month', createProjectsMonth);
projectsRouter.patch('/month', patchProjectsMonth);

export default projectsRouter;
