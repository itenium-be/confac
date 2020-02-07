import {Router} from 'express';
import {getConsultants, saveConsultant} from '../controllers/consultants';

const consultantsRouter = Router();

consultantsRouter.get('/', getConsultants);
consultantsRouter.post('/', saveConsultant);

export default consultantsRouter;
