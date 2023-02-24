import {ConsultantModel} from './ConsultantModel';
import {IAudit} from '../../../models';

export const getNewConsultant = (): ConsultantModel => ({
  _id: '',
  name: '',
  firstName: '',
  slug: '',
  type: 'consultant',
  email: '',
  telephone: '',
  active: true,
  audit: {} as IAudit,
});
