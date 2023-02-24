import {Router} from 'express';
import {getConsultants, saveConsultant} from '../controllers/consultants';

const consultantsRouter = Router();

consultantsRouter.get('/', getConsultants);
consultantsRouter.post('/', saveConsultant as any);

export default consultantsRouter;
