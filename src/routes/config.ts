import {Router} from 'express';
import {getCompanyConfig, getTemplates, saveCompanyConfig, getSecurityConfig} from '../controllers/config';

const configRouter = Router();

configRouter.get('/', getCompanyConfig);
configRouter.get('/security', getSecurityConfig);
configRouter.get('/templates', getTemplates);
configRouter.post('/', saveCompanyConfig as any);

export default configRouter;
