import {Router} from 'express';
import {getCompanyConfig, getTemplates, saveCompanyConfig} from '../controllers/config';

const configRouter = Router();

configRouter.get('/', getCompanyConfig);
configRouter.get('/templates', getTemplates);
configRouter.post('/', saveCompanyConfig);

export default configRouter;
