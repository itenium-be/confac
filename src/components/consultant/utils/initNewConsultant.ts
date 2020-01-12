import {ConsultantModel} from '../models';

export const initNewConsultant = (): ConsultantModel => ({
  name: '',
  firstName: '',
  type: 'consultant',
  email: '',
  telephone: '',
});
