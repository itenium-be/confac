import {Router} from 'express';
import {getConsultants} from '../controllers/consultants';

const consultantsRouter = Router();

consultantsRouter.get('/', getConsultants);

export default consultantsRouter;
