import {Router} from 'express';
import {getPublicProjectsController} from '../controllers/publicProjects';

const publicRouter = Router();

publicRouter.get('/projects', getPublicProjectsController);

export default publicRouter;
