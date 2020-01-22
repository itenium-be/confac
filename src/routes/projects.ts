import {Router} from 'express';
import {getProjects, getProjectsPerMonth} from '../controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/', getProjects);

projectsRouter.get('/month', getProjectsPerMonth);

export default projectsRouter;
