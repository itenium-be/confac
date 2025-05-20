import {Router} from 'express';
import {deleteProject, getProjects, saveProject} from '../controllers/projects';
import {
  getProjectsPerMonthController, createProjectsMonthController,
  patchProjectsMonthController, getProjectsPerMonthOverviewController,
  deleteProjectsMonthController,
} from '../controllers/projectsMonth';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', saveProject as any);
projectsRouter.delete('/', deleteProject as any);

projectsRouter.get('/month', getProjectsPerMonthController);
projectsRouter.get('/month/overview', getProjectsPerMonthOverviewController);
projectsRouter.post('/month', createProjectsMonthController as any);
projectsRouter.patch('/month', patchProjectsMonthController as any);
projectsRouter.delete('/month', deleteProjectsMonthController as any);

export default projectsRouter;
