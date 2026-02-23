import {Router, RequestHandler} from 'express';
import {deleteProject, getProjects, saveProject, generateExcelForProjectsController} from '../controllers/projects';
import {
  getProjectsPerMonthController, createProjectsMonthController,
  patchProjectsMonthController, getProjectsPerMonthOverviewController,
  deleteProjectsMonthController, generateExcelForProjectsMonthController,
  generateFreelancerExcel,
} from '../controllers/projectsMonth';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);
projectsRouter.post('/', saveProject as unknown as RequestHandler);
projectsRouter.delete('/', deleteProject as unknown as RequestHandler);
projectsRouter.post('/excel', generateExcelForProjectsController);

projectsRouter.get('/month', getProjectsPerMonthController);
projectsRouter.get('/month/overview', getProjectsPerMonthOverviewController);
projectsRouter.post('/month', createProjectsMonthController as unknown as RequestHandler);
projectsRouter.patch('/month', patchProjectsMonthController as unknown as RequestHandler);
projectsRouter.delete('/month', deleteProjectsMonthController as unknown as RequestHandler);
projectsRouter.post('/month/excel', generateExcelForProjectsMonthController);
projectsRouter.post('/month/freelancer-excel', generateFreelancerExcel);

export default projectsRouter;
