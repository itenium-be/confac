import {Router} from 'express';
import {getConsultants, createConsultant} from '../controllers/consultants';

const consultantsRouter = Router();

consultantsRouter.get('/', getConsultants);
consultantsRouter.post('/', createConsultant);

export default consultantsRouter;
