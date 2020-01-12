import {ConsultantModel} from '../models/ConsultantModel';

export const initNewConsultant = (): ConsultantModel => ({
  name: '',
  firstName: '',
  type: 'consultant',
  email: '',
  telephone: '',
});
