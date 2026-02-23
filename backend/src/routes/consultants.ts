import {Router, RequestHandler} from 'express';
import {getConsultants, saveConsultant} from '../controllers/consultants';

const consultantsRouter = Router();

consultantsRouter.get('/', getConsultants);
consultantsRouter.post('/', saveConsultant as RequestHandler);

export default consultantsRouter;
