import {Router} from 'express';
import {deleteProject, getProjects, saveProject, generateExcelForProjectsController} from '../controllers/projects';
import {
  getProjectsPerMonthController, createProjectsMonthController,
  patchProjectsMonthController, getProjectsPerMonthOverviewController,
  deleteProjectsMonthController, generateExcelForProjectsMonthController,
  generateFreelancerExcel,
} from '../controllers/projectsMonth';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', saveProject as any);
projectsRouter.delete('/', deleteProject as any);
projectsRouter.post('/excel', generateExcelForProjectsController);

projectsRouter.get('/month', getProjectsPerMonthController);
projectsRouter.get('/month/overview', getProjectsPerMonthOverviewController);
projectsRouter.post('/month', createProjectsMonthController as any);
projectsRouter.patch('/month', patchProjectsMonthController as any);
projectsRouter.delete('/month', deleteProjectsMonthController as any);
projectsRouter.post('/month/excel', generateExcelForProjectsMonthController);
projectsRouter.post('/month/freelancer-excel', generateFreelancerExcel);

export default projectsRouter;
