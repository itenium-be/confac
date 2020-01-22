import {Router} from 'express';
import {getCompanyConfig, getTemplates} from '../controllers/config';

const configRouter = Router();

configRouter.get('/', getCompanyConfig);

configRouter.get('/templates', getTemplates);

export default configRouter;
