import {Router} from 'express';
import {getProjects, saveProject} from '../controllers/projects';
import {getProjectsPerMonthController, createProjectsMonthController, patchProjectsMonthController, getProjectsPerMonthOverviewController} from '../controllers/projectsMonth';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', saveProject);

projectsRouter.get('/month', getProjectsPerMonthController);
projectsRouter.get('/month/overview', getProjectsPerMonthOverviewController);
projectsRouter.post('/month', createProjectsMonthController);
projectsRouter.patch('/month', patchProjectsMonthController);

export default projectsRouter;
