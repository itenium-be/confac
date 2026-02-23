import {Router, RequestHandler} from 'express';
import {getCompanyConfig, getTemplates, saveCompanyConfig, getSecurityConfig, getAudit} from '../controllers/config';

const configRouter = Router();

configRouter.get('/', getCompanyConfig);
configRouter.get('/security', getSecurityConfig);
configRouter.get('/templates', getTemplates);
configRouter.post('/', saveCompanyConfig as unknown as RequestHandler);
configRouter.get('/audit', getAudit);

export default configRouter;
